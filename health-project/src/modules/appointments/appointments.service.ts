import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { User } from '../../entities/user.entity';
import { DateTime } from 'luxon';
import { UserRole } from '../../lib/types';

export type AppointmentStatus = 'pending' | 'approved' | 'rescheduled' | 'cancelled';

/**
 * DTOs ─ for brevity they are declared inline.
 * In a real‑world project export each DTO from a dedicated folder and decorate
 * with class‑validator decorators.
 */
export interface CreateAppointmentDto {
  /** RFC‑3339 / ISO 8601 datetime string */
  date: string;
  /** optional preferred staff id */
  staffId?: number;
}

export interface UpdateAppointmentDto {
  /** new datetime */
  date?: string;
  /** new staff */
  staffId?: number | null;
  /** status */
  status?: AppointmentStatus;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Student creates a new appointment request (status = "pending").
   */
  async create(student: User, dto: CreateAppointmentDto): Promise<Appointment> {
    if (student.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can book appointments');
    }

    const date = DateTime.fromISO(dto.date, { zone: 'utc' }).startOf('minute');
    if (!date.isValid) {
      throw new BadRequestException('Invalid appointment date');
    }
    if (date <= DateTime.utc()) {
      throw new BadRequestException('Appointment date must be in the future');
    }

    // Simple conflict: student already has pending/approved appt at exact time
    const clash = await this.appointmentRepo.findOne({
      where: {
        student: { id: student.id },
        date: date.toJSDate(),
        status: In(['pending', 'approved', 'rescheduled']),
      },
    });
    if (clash) {
      throw new ConflictException('You already have an appointment for that time');
    }

    let staff: User | null = null;
    if (dto.staffId) {
      staff = await this.userRepo.findOne({ where: { id: dto.staffId, role: 'clinic_staff' } });
      if (!staff) throw new NotFoundException('Requested staff not found');
    }

    const appt = this.appointmentRepo.create({
      student,
      staff: staff ?? null,
      date: date.toJSDate(),
      status: 'pending',
    });
    return this.appointmentRepo.save(appt);
  }

  /**
   * Get appointments. Students -> their own, Staff -> assigned, Admin -> all.
   * Optional filters & pagination supported.
   */
  async findAll(user: User, page = 1, perPage = 20) {
    const qb = this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.student', 'student')
      .leftJoinAndSelect('appointment.staff', 'staff')
      .orderBy('appointment.date', 'ASC')
      .skip((page - 1) * perPage)
      .take(perPage);

    if (user.role === UserRole.STUDENT) {
      qb.where('student.id = :studentId', { studentId: user.id });
    } else if (user.role === UserRole.CLINIC_STAFF) {
      qb.where('staff.id = :staffId', { staffId: user.id });
    }
    // admins see all

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, perPage };
  }

  async findOne(id: number, requester: User): Promise<Appointment> {
    const appt = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['student', 'staff'],
    });
    if (!appt) throw new NotFoundException('Appointment not found');

    if (requester.role === 'student' && appt.student.id !== requester.id) {
      throw new ForbiddenException();
    }
    if (requester.role === 'clinic_staff' && appt.staff?.id !== requester.id) {
      throw new ForbiddenException();
    }
    return appt;
  }

  /**
   * Clinic staff or admin updates appointment.
   * - status changes (approve, reschedule, cancel)
   * - date change (reschedule)
   * - staff reassignment
   */
  async update(id: number, user: User, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appt = await this.appointmentRepo.findOne({ where: { id }, relations: ['student', 'staff'] });
    if (!appt) throw new NotFoundException('Appointment not found');

    if (user.role === UserRole.CLINIC_STAFF && appt.staff?.id !== user.id) {
      throw new ForbiddenException('Not your appointment');
    }
    if (user.role === UserRole.STUDENT) {
      throw new ForbiddenException('Students cannot modify appointments once created');
    }

    if (dto.date) {
      const newDateLuxon = DateTime.fromISO(dto.date, { zone: 'utc' }).startOf('minute');
      if (!newDateLuxon.isValid) throw new BadRequestException('Invalid date');
      if (newDateLuxon <= DateTime.utc()) throw new BadRequestException('Date must be in future');
      appt.date = newDateLuxon.toJSDate();
      appt.status = 'rescheduled';
    }

    if (dto.status) {
      if (!['approved', 'rescheduled', 'cancelled'].includes(dto.status)) {
        throw new BadRequestException('Invalid status');
      }
      appt.status = dto.status;
    }

    if (dto.staffId !== undefined) {
      if (dto.staffId === null) appt.staff = null;
      else {
        const newStaff = await this.userRepo.findOne({ where: { id: dto.staffId, role: 'clinic_staff' } });
        if (!newStaff) throw new NotFoundException('Staff not found');
        appt.staff = newStaff;
      }
    }

    return this.appointmentRepo.save(appt);
  }

  /** Soft‑delete or hard‑delete depending on retention policy. */
  async cancel(id: number, requester: User): Promise<void> {
    const appt = await this.appointmentRepo.findOne({ where: { id }, relations: ['student', 'staff'] });
    if (!appt) throw new NotFoundException('Appointment not found');

    if (requester.role === 'student' && appt.student.id !== requester.id) {
      throw new ForbiddenException();
    }
    if (requester.role === 'clinic_staff' && appt.staff?.id !== requester.id) {
      throw new ForbiddenException();
    }
    if (appt.status === 'cancelled') return;
    appt.status = 'cancelled';
    await this.appointmentRepo.save(appt);
  }

  /**
   * House‑keeping job to purge past cancelled appointments.
   */
  async purgeOldCancelled(days = 90) {
    const cutoff = DateTime.utc().minus({ days }).toJSDate();
    await this.appointmentRepo.delete({ status: 'cancelled' as AppointmentStatus, date: LessThan(cutoff) });
  }
}

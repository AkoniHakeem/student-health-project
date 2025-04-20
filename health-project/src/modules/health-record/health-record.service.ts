import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecordEntry } from '../../entities/health-record-entry.entity';
import { Appointment } from '../../entities/appointment.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class HealthRecordService {
  constructor(
    @InjectRepository(HealthRecordEntry)
    private readonly entryRepo: Repository<HealthRecordEntry>,
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
  ) {}

  async addEntry(appointmentId: number, author: User, note: string): Promise<HealthRecordEntry> {
    const appointment = await this.apptRepo.findOne({
      where: { id: appointmentId },
      relations: ['student', 'staff', 'student.healthRecord'],
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.staff?.id !== author.id) {
      throw new ForbiddenException('You are not assigned to this appointment');
    }

    const entry = this.entryRepo.create({
      healthRecord: appointment.student.healthRecord,
      appointment,
      author,
      note,
    });

    return this.entryRepo.save(entry);
  }

  async getEntriesByStudent(studentId: number): Promise<HealthRecordEntry[]> {
    return this.entryRepo.find({
      where: { healthRecord: { student: { id: studentId } } },
      relations: ['appointment', 'author'],
    });
  }

  async getEntriesByAppointment(appointmentId: number): Promise<HealthRecordEntry[]> {
    return this.entryRepo.find({
      where: { appointment: { id: appointmentId } },
      relations: ['author'],
    });
  }
}
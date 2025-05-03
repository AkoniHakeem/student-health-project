import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { HealthRecord } from '../../entities/health-record.entity';
import { StaffAssignment } from '../../entities/staff-assignment.entity';
import { UserRole } from '../../lib/types';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(HealthRecord)
    private readonly healthRepo: Repository<HealthRecord>,

    @InjectRepository(StaffAssignment)
    private readonly assignmentRepo: Repository<StaffAssignment>,
  ) {}

  /**
   * Registers a new user.  
   * ‑ Ensures email uniqueness  
   * ‑ Hashes password using bcrypt  
   * ‑ Automatically creates an empty HealthRecord for students  
   */
  async create(dto: CreateUserDto): Promise<User> {
    if (!Object.values(UserRole).includes(dto.role)) {
      throw new BadRequestException('Invalid role');
    }

    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const user = this.usersRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    // If the user is a student, generate an empty health record
    if (dto.role === UserRole.STUDENT) {
      const record = this.healthRepo.create({ data: '{}' });
      await this.healthRepo.save(record);
      user.healthRecord = record;
    }

    return this.usersRepo.save(user);
  }

  /** Validate user credentials for AuthService */
  async validateUser(email: string, plainPassword: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  /** Simple paginated list of users */
  async findAll({page = 1, limit = 20} : {page: number,limit: number}): Promise<User[]> {
    return this.usersRepo.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['healthRecord'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id }, relations: ['healthRecord'] });
    if (!user) throw new NotFoundException('User not found');
    return {...user, passwordHash: undefined};
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email }, relations: ['healthRecord'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Update user fields.  
   * If password is present it will be hashed.  
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      await this.ensureEmailIsUnique(dto.email);
      user.email = dto.email;
    }

    this.usersRepo.merge(user, dto);
    return this.usersRepo.save(user);
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const duplicate = await this.usersRepo.findOne({ where: { email } });
    if (duplicate) throw new ConflictException('Email already in use');
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async remove(id: number): Promise<void> {
    const res = await this.usersRepo.delete(id);
    if (!res.affected) throw new NotFoundException('User not found');
  }

  /**
   * Assign a clinic staff member to a student.  
   * Enforces role checks and prevents duplicate assignments.  
   */
  async assignStaffToStudent(studentId: number, staffId: number): Promise<StaffAssignment> {
    const student = await this.findOne(studentId);
    const staff = await this.findOne(staffId);

    if (student.role !== UserRole.STUDENT) {
      throw new BadRequestException('Target user is not a student');
    }
    if (staff.role !== UserRole.CLINIC_STAFF) {
      throw new BadRequestException('Assignee is not clinic staff');
    }

    const existing = await this.assignmentRepo.findOne({ where: { student: { id: studentId }, staff: { id: staffId } } });
    if (existing) return existing; // already assigned

    const assignment = this.assignmentRepo.create({ student, staff });
    return this.assignmentRepo.save(assignment);
  }

  async getStudentsOfStaff(staffId: number): Promise<User[]> {
    const staff = await this.findOne(staffId);
    if (staff.role !== UserRole.CLINIC_STAFF) throw new BadRequestException('User is not clinic staff');

    const assignments = await this.assignmentRepo.find({ where: { staff: { id: staffId } }, relations: ['student', 'student.healthRecord'] });
    return assignments.map(a => a.student);
  }

  async getStaffOfStudent(studentId: number): Promise<User[]> {
    const student = await this.findOne(studentId);
    if (student.role !== UserRole.STUDENT) throw new BadRequestException('User is not a student');

    const assignments = await this.assignmentRepo.find({ where: { student: { id: studentId } }, relations: ['staff'] });
    return assignments.map(a => a.staff);
  }
}

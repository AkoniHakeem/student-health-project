// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { HealthRecord } from './health-record.entity';
import { Appointment } from './appointment.entity';
import { SymptomLog } from './symptom-log.entity';
import { StaffAssignment } from './staff-assignment.entity';
import { UserRole } from '../lib/types';
import { HealthRecordEntry } from './health-record-entry.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
  
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole, // Use the new enum
  })
  role: UserRole;

  // If the user is a student, they can have one health record.
  @OneToOne(() => HealthRecord, healthRecord => healthRecord.student, { cascade: true, nullable: true })
  @JoinColumn()
  healthRecord: HealthRecord;

  // One-to-many: A student can have many appointments.
  @OneToMany(() => Appointment, appointment => appointment.student)
  appointments: Appointment[];

  // One-to-many: A clinic staff member can be assigned many appointments.
  @OneToMany(() => Appointment, appointment => appointment.staff)
  assignedAppointments: Appointment[];

  // One-to-many: A student can generate many symptom logs.
  @OneToMany(() => SymptomLog, symptomLog => symptomLog.student)
  symptomLogs: SymptomLog[];

  // One-to-many: A student can be assigned to many clinic staff via StaffAssignment.
  @OneToMany(() => StaffAssignment, assignment => assignment.student)
  staffAssignments: StaffAssignment[];

  // One-to-many: A clinic staff can be assigned to many students via StaffAssignment.
  @OneToMany(() => StaffAssignment, assignment => assignment.staff)
  studentAssignments: StaffAssignment[];

  // One-to-many: A clinic staff can author many health record entries.
  @OneToMany(() => HealthRecordEntry, entry => entry.author)
  authoredEntries: HealthRecordEntry[];
}

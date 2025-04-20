import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { HealthRecord } from './health-record.entity';
import { Appointment } from './appointment.entity';
import { User } from './user.entity';

@Entity()
export class HealthRecordEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HealthRecord, healthRecord => healthRecord.entries, { onDelete: 'CASCADE' })
  healthRecord: HealthRecord;

  @ManyToOne(() => Appointment, appointment => appointment.healthRecordEntries, { onDelete: 'CASCADE' })
  appointment: Appointment;

  @ManyToOne(() => User, user => user.authoredEntries)
  author: User; // Clinic staff who authored the entry

  @Column('text')
  note: string; // Clinical note, vitals, etc.

  @CreateDateColumn()
  createdAt: Date;
}
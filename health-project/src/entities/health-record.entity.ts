// src/entities/health-record.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { HealthRecordEntry } from './health-record-entry.entity';

@Entity()
export class HealthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  // Stores medical history, prescriptions, and notes in a text field.
  @Column('text')
  data: string;

  @CreateDateColumn()
  createdAt: Date;

  // One-to-one relationship back to the User (student)
  @OneToOne(() => User, user => user.healthRecord)
  student: User;

  @OneToMany(() => HealthRecordEntry, entry => entry.healthRecord)
  entries: HealthRecordEntry[]; // New relationship
}

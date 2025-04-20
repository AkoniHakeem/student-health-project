// src/entities/symptom-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SymptomLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  input: string;

  @Column('text')
  aiResponse: string;

  @CreateDateColumn()
  timestamp: Date;

  // Many symptom logs belong to one student.
  @ManyToOne(() => User, user => user.symptomLogs)
  student: User;
}

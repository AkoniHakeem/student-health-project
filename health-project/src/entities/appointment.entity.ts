// src/entities/appointment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { HealthRecordEntry } from './health-record-entry.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('timestamp')
  date: Date;

  // For instance: "pending", "approved", "rescheduled"
  @Column()
  status: string;

  // Many appointments can be linked to one student.
  @ManyToOne(() => User, user => user.appointments)
  student: User;

  // Many appointments can be assigned to one clinic staff; this relation is optional.
  @ManyToOne(() => User, user => user.assignedAppointments, { nullable: true })
  staff: User;

  @OneToMany(() => HealthRecordEntry, entry => entry.appointment)
  healthRecordEntries: HealthRecordEntry[]; // New relationship
}

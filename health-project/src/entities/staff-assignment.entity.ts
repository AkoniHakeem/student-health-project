// src/entities/staff-assignment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity()
  export class StaffAssignment {
    @PrimaryGeneratedColumn()
    id: number;
  
    // The student to which a clinic staff is assigned.
    @ManyToOne(() => User, user => user.staffAssignments)
    student: User;
  
    // The clinic staff assigned to the student.
    @ManyToOne(() => User, user => user.studentAssignments)
    staff: User;
  }
  
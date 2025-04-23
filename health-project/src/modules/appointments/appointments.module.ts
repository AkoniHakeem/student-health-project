import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { User } from '../../entities/user.entity';
import { HealthRecord } from '../../entities/health-record.entity';
import { StaffAssignment } from '../../entities/staff-assignment.entity'; // Import the StaffAssignment entity
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { JwtService } from '../users/jwt.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, HealthRecord, StaffAssignment]), // Register StaffAssignment entity
  ],
  providers: [AppointmentsService, JwtAuthGuard, RolesGuard, JwtService, UsersService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}

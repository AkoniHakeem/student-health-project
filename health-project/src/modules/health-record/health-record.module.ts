// src/modules/health-record/health-record.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecordEntry } from '../../entities/health-record-entry.entity';
import { Appointment } from '../../entities/appointment.entity';
import { HealthRecordService } from './health-record.service';
import { HealthRecordController } from './health-record.controller';
import { UsersModule } from '../users/users.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { JwtService } from '../users/jwt.service';
import { AppointmentsService } from '../appointments/appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthRecordEntry, Appointment]),
    UsersModule,
    AppointmentsModule,
  ],
  providers: [HealthRecordService, JwtService, AppointmentsService],
  controllers: [HealthRecordController],
})
export class HealthRecordModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecordEntry } from '../../entities/health-record-entry.entity';
import { Appointment } from '../../entities/appointment.entity';
import { HealthRecordService } from './health-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthRecordEntry, Appointment])],
  providers: [HealthRecordService],
  exports: [HealthRecordService],
})
export class HealthRecordModule {}
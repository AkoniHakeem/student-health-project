import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';

@Controller('health-records')
@UseGuards(JwtAuthGuard)
export class HealthRecordController {
  constructor(private readonly healthRecordService: HealthRecordService) {}

  @Post(':appointmentId/entries')
  async addEntry(
    @Param('appointmentId') appointmentId: number,
    @Body('note') note: string,
    @Body('author') author: User,
  ) {
    return this.healthRecordService.addEntry(appointmentId, author, note);
  }

  @Get('students/:studentId/entries')
  async getEntriesByStudent(@Param('studentId') studentId: number) {
    return this.healthRecordService.getEntriesByStudent(studentId);
  }

  @Get('appointments/:appointmentId/entries')
  async getEntriesByAppointment(@Param('appointmentId') appointmentId: number) {
    return this.healthRecordService.getEntriesByAppointment(appointmentId);
  }
}
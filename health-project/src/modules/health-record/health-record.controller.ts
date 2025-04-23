import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { UserRole } from '../../lib/types';
import { UsersService } from '../users/users.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { Roles } from 'src/lib/decorators/roles.decorators';
import { CreateHealthRecordEntryDto } from '../appointments/dto/create-health-record.dto';

@Controller()
export class HealthRecordController {
  constructor(
    private readonly svc: HealthRecordService,
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  /** Clinic staff adds a visit note to an appointment */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLINIC_STAFF)
  @Post('appointments/:appointmentId/records')
  async addEntry(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() dto: CreateHealthRecordEntryDto,
    @Request() req,
  ) {
    const author = await this.usersService.findOne(req.user.sub);
    return this.svc.addEntry(appointmentId, author, dto.note);
  }

  /** View all notes for a given student */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.CLINIC_STAFF, UserRole.ADMIN)
  @Get('students/:studentId/records')
  async getByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Request() req,
  ) {
    const user = await this.usersService.findOne(req.user.sub);
    if (user.role === UserRole.STUDENT && user.id !== studentId) {
      throw new ForbiddenException('Cannot view other students’ records');
    }
    return this.svc.getEntriesByStudent(studentId);
  }

  /** View all notes for a specific appointment */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.CLINIC_STAFF, UserRole.ADMIN)
  @Get('appointments/:appointmentId/records')
  async getByAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Request() req,
  ) {
    const user = await this.usersService.findOne(req.user.sub);
    // ensure the user can see this appointment
    await this.appointmentsService.findOne(appointmentId, user);
    return this.svc.getEntriesByAppointment(appointmentId);
  }
}
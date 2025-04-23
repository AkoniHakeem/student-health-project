import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { DashboardDto } from './dto/dashboard.dto';
import { UserRole } from '../../lib/types';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { Roles } from 'src/lib/decorators/roles.decorators';
import { QueryAppointmentsDto } from './dto/query-appointment.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly svc: AppointmentsService,
    private readonly usersService: UsersService, // Inject UsersService to fetch the user
  ) {}

  // Student books an appointment → status = pending
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req,
    @Body() dto: CreateAppointmentDto,
  ) {
    const student = await this.usersService.findOne(req.user.sub); // Fetch the student object
    return this.svc.create(student, dto);
  }

  // List appointments (with filters & pagination)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CLINIC_STAFF, UserRole.STUDENT)
  @Get()
  async findAll(
    @Request() req,
    @Query() query: QueryAppointmentsDto,
  ) {
    const { page = 1, perPage = 20 } = query;
    return this.svc.findAll(req.user, page, perPage);
  }

  // Get one appointment by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.findOne(id, req.user);
  }

  // Update any mutable fields (date, status, staff assignment)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLINIC_STAFF)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.svc.update(id, req.user as Partial<User>, dto);
  }

  // Cancel an appointment (student or staff)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.sub;
    return this.svc.cancel(id, userId);
  }

  // (Optional) Approve endpoint for clarity
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLINIC_STAFF)
  @Patch(':id/approve')
  async approve(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.approve(id);
  }

  /** Student dashboard data */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Get('dashboard')
  async dashboard(@Request() req): Promise<DashboardDto> {
    const student = await this.usersService.findOne(req.user.sub); // Fetch the student object
    return this.svc.getDashboard(student); // Call the service method
  }
}

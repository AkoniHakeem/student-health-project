import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Param,
    ParseIntPipe,
  } from '@nestjs/common';
  import { UserRole } from '../../lib/types';
  import { UsersService } from '../users/users.service';
import { Roles } from 'src/lib/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { CreateSymptomLogDto } from './dtos/CreateSymptomLog.dto';
import { SymptomLogsService } from './system-logs.service';
  
  @Controller('symptom-logs')
  export class SymptomLogsController {
    constructor(
      private readonly svc: SymptomLogsService,
      private readonly usersService: UsersService,
    ) {}
  
    /** POST /symptom-logs **/
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @Post()
    async create(
      @Request() req,
      @Body() dto: CreateSymptomLogDto,
    ) {
      const student = await this.usersService.findOne(req.user.sub);
      return this.svc.createLog(student, dto);
    }
  
    /** GET /symptom-logs **/
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT)
    @Get()
    async findMine(@Request() req) {
      const student = await this.usersService.findOne(req.user.sub);
      return this.svc.findByStudent(student);
    }
  
    /** GET /symptom-logs/:id **/
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.STUDENT, UserRole.CLINIC_STAFF, UserRole.ADMIN)
    @Get(':id')
    async findOne(
      @Request() req,
      @Param('id', ParseIntPipe) id: number,
    ) {
      const user = await this.usersService.findOne(req.user.sub);
      return this.svc.findOne(id, user);
    }
  
    /** GET /symptom-logs/students/:studentId **/
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(UserRole.CLINIC_STAFF, UserRole.ADMIN)
    @Get('students/:studentId')
    async findForStudent(
      @Param('studentId', ParseIntPipe) studentId: number,
    ) {
      return this.svc.findForStudent(studentId);
    }
  }
  
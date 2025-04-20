// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from 'src/lib/guards/jwtAuth.guard';
import { RolesGuard } from 'src/lib/guards/roles.guard';
import { HealthRecord } from 'src/entities/health-record.entity';
import { StaffAssignment } from 'src/entities/staff-assignment.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User,  HealthRecord, StaffAssignment]),
  ],
  providers: [
    UsersService,
    JwtService,
    JwtAuthGuard,
    RolesGuard,
  ],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

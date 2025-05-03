import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SymptomLog } from '../../entities/symptom-log.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SymptomLogsController } from './system-logs.controller';
import { SymptomLogsService } from './system-logs.service';
import { JwtService } from '../users/jwt.service';
import { RolesGuard } from 'src/lib/guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([SymptomLog]),
    UsersModule,
  ],
  providers: [SymptomLogsService, JwtService, RolesGuard],
  controllers: [SymptomLogsController],
})
export class SymptomLogsModule {}

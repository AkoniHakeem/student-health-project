import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HealthRecord } from './entities/health-record.entity';
import { Appointment } from './entities/appointment.entity';
import { SymptomLog } from './entities/symptom-log.entity';
import { StaffAssignment } from './entities/staff-assignment.entity';
import { UsersModule } from './modules/users/users.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { HealthRecordModule } from './modules/health-record/health-record.module';
import { HealthRecordEntry } from './entities/health-record-entry.entity';
import { SymptomLogsModule } from './modules/system-logs/system-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, HealthRecord, Appointment, SymptomLog, StaffAssignment, HealthRecordEntry],
        synchronize: true,
        logging: 'all',
        logger: 'file',
      }),
    }),
    UsersModule,
    AppointmentsModule,
    HealthRecordModule,
    SymptomLogsModule,
  ],
})
export class AppModule {}

import { IsISO8601, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { AppointmentStatus } from 'src/lib/types';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsISO8601({ strict: true }, { message: 'date must be a valid ISO 8601 string' })
  date?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'status must be one of pending|approved|rescheduled|cancelled' })
  status?: AppointmentStatus;

  // Allow staff to claim/unclaim an appointment
  @IsOptional()
  @IsNumberString({}, { message: 'staffId must be a number' })
  staffId?: string;
}

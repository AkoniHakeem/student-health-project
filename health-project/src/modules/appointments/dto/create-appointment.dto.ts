import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsISO8601({ strict: true }, { message: 'date must be a valid ISO 8601 string' })
  date: string;
  /** optional preferred staff id */
  @IsOptional()
  @IsString()
  staffId?: number;
}
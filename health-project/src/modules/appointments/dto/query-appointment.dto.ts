import {
    IsEnum,
    IsInt,
    IsISO8601,
    IsOptional,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
import { AppointmentStatus } from 'src/lib/types';
  
  export class QueryAppointmentsDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    studentId?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    staffId?: number;
  
    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;
  
    @IsOptional()
    @IsISO8601({ strict: true })
    dateFrom?: string;
  
    @IsOptional()
    @IsISO8601({ strict: true })
    dateTo?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    perPage?: number;
  }
  
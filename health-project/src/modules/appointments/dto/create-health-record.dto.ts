// src/modules/health-record/dto/create-health-record-entry.dto.ts
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateHealthRecordEntryDto {
  @IsNotEmpty()
  @MaxLength(5000)
  note: string;
}

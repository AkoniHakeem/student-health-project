import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSymptomLogDto {
  @IsNotEmpty()
  @MaxLength(1000)
  input: string;
}

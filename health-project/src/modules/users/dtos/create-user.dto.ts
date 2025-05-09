import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";
import { UserRole } from "../../../lib/types";

export class CreateUserDto {
  @IsNotEmpty() 
  firstName: string;

  @IsNotEmpty() 
  lastName: string;

  @IsEmail() 
  email: string;

  @MinLength(6) 
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

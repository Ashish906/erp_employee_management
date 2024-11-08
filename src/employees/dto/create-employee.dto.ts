import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsInt()
  position_id: number;

  @IsInt()
  @IsOptional()
  supervisor_id: number;

  @IsEmail()
  email: string;
}

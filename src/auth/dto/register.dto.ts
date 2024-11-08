import { IsEmail, IsEnum, IsString } from 'class-validator';
enum RegistrationRole {
  admin = 'admin'
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsEnum(RegistrationRole)
  role: RegistrationRole;
}
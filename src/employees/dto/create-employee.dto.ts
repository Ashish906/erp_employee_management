import { IsInt, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsInt()
  position_id: number;

  @IsInt()
  supervisor_id: number;
}

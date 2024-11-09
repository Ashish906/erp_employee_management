import { IsInt, Max, Min } from 'class-validator';

export class CommonQueryDto {
  @IsInt()
  page: number;

  @Max(50)
  @Min(1)
  @IsInt()
  size: number;
}
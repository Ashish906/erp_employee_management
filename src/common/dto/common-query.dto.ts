import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CommonQueryDto {
  @IsInt()
  @Type(() => Number)
  page: number;

  @Max(50)
  @Min(1)
  @IsInt()
  @Type(() => Number)
  size: number;
}
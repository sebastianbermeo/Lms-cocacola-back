import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUrl()
  @IsOptional()
  img?: string;

  @IsInt()
  moduleId: number;
}
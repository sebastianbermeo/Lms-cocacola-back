import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUrl()
  @IsOptional()
  video?: string;

  @IsUrl()
  @IsOptional()
  img?: string;

  @IsUrl()
  @IsOptional()
  file?: string;

  @IsInt()
  courseId: number;
}
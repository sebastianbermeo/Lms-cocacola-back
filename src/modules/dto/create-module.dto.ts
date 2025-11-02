import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateModuleDto {
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
}
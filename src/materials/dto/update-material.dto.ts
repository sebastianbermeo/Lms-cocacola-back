import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-material.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @IsInt()
  @IsOptional()
  courseId?: number;
}
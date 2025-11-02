import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsInt()
  @IsOptional()
  moduleId?: number;
}
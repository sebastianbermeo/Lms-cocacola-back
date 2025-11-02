import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import { CreateCourseDto } from '../courses/dto/create-course.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';
import { ModuleEntity } from '../modules/entities/module.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepo: Repository<Course>,

    @InjectRepository(ModuleEntity)
    private readonly modulesRepo: Repository<ModuleEntity>,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    const module = await this.modulesRepo.findOne({ where: { id: dto.moduleId } });
    if (!module) {
      throw new NotFoundException(`Module with id ${dto.moduleId} not found`);
    }

    const course = this.coursesRepo.create({
      ...dto,
      module,
    });

    return await this.coursesRepo.save(course);
  }

  async findAll(): Promise<Course[]> {
    return await this.coursesRepo.find({
      relations: ['module', 'materials'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepo.findOne({
      where: { id },
      relations: ['module', 'materials'],
    });

    if (!course) throw new NotFoundException(`Course with id ${id} not found`);
    return course;
  }

  async update(id: number, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    if (dto.moduleId) {
      const module = await this.modulesRepo.findOne({ where: { id: dto.moduleId } });
      if (!module) {
        throw new NotFoundException(`Module with id ${dto.moduleId} not found`);
      }
      course.module = module;
    }

    Object.assign(course, dto);
    return await this.coursesRepo.save(course);
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.coursesRepo.remove(course);
  }
}
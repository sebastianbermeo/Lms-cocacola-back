import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from '../materials/entities/material.entity';
import { CreateMaterialDto } from '../materials/dto/create-material.dto';
import { UpdateMaterialDto } from '../materials/dto/update-material.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialsRepo: Repository<Material>,

    @InjectRepository(Course)
    private readonly coursesRepo: Repository<Course>,
  ) {}

  async create(dto: CreateMaterialDto): Promise<Material> {
    const course = await this.coursesRepo.findOne({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException(`Course with id ${dto.courseId} not found`);
    }

    const material = this.materialsRepo.create({
      ...dto,
      course,
    });

    return await this.materialsRepo.save(material);
  }

  async findAll(): Promise<Material[]> {
    return await this.materialsRepo.find({
      relations: ['course', 'course.module'],
    });
  }

  async findOne(id: number): Promise<Material> {
    const material = await this.materialsRepo.findOne({
      where: { id },
      relations: ['course', 'course.module'],
    });

    if (!material) throw new NotFoundException(`Material with id ${id} not found`);
    return material;
  }

  async update(id: number, dto: UpdateMaterialDto): Promise<Material> {
    const material = await this.findOne(id);

    if (dto.courseId) {
      const course = await this.coursesRepo.findOne({ where: { id: dto.courseId } });
      if (!course) {
        throw new NotFoundException(`Course with id ${dto.courseId} not found`);
      }
      material.course = course;
    }

    Object.assign(material, dto);
    return await this.materialsRepo.save(material);
  }

  async remove(id: number): Promise<void> {
    const material = await this.findOne(id);
    await this.materialsRepo.remove(material);
  }
}
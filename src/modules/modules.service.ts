import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleEntity } from './entities/module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly modulesRepo: Repository<ModuleEntity>,
  ) {}

  async create(dto: CreateModuleDto): Promise<ModuleEntity> {
    const module = this.modulesRepo.create(dto);
    return await this.modulesRepo.save(module);
  }

  async findAll(): Promise<any[]> {
    const modules = await this.modulesRepo.find({
      relations: ['courses', 'courses.materials'],
    });

    return modules.map((mod) => ({
      id: mod.id,
      titulo: mod.titulo,
      descripcion: mod.descripcion,
      img: mod.img,
      courses: mod.courses.map((course) => ({
        id: course.id,
        materials: course.materials.map((material) => material.id),
      })),
    }));
  }

  async findOne(id: number): Promise<ModuleEntity> {
    const module = await this.modulesRepo.findOne({
      where: { id },
      relations: ['courses', 'courses.materials'],
    });

    if (!module) throw new NotFoundException(`Module with id ${id} not found`);
    return module;
  }

  async update(id: number, dto: UpdateModuleDto): Promise<ModuleEntity> {
    const module = await this.findOne(id);
    Object.assign(module, dto);
    return await this.modulesRepo.save(module);
  }

  async remove(id: number): Promise<void> {
    const module = await this.findOne(id);
    await this.modulesRepo.remove(module);
  }
}
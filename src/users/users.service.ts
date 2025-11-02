import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rol } from '../rol/entities/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async findByEmailIncludePassword(email: string): Promise<User | null> {
    return await this.usersRepo
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .addSelect('u.password')
      .getOne();
  }

  async create(dto: CreateUserDto): Promise<User> {
    // Buscar el rol antes de crear el usuario
    const rol = await this.rolRepo.findOne({ where: { id: dto.rolId } });
    if (!rol) {
      throw new NotFoundException(`Rol with id ${dto.rolId} not found`);
    }

    // Crear el usuario con su rol
    const user = this.usersRepo.create({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
      rol, // Objeto Rol (no el id)
    });

    return await this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    // Cargar usuarios con su rol
    return await this.usersRepo.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['rol'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se envía un nuevo rol
    if (dto.rolId) {
      const rol = await this.rolRepo.findOne({ where: { id: dto.rolId } });
      if (!rol) {
        throw new NotFoundException(`Rol with id ${dto.rolId} not found`);
      }
      user.rol = rol;
    }

    // Actualizar los demás campos
    Object.assign(user, dto);
    return await this.usersRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }
}
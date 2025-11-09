import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  // Crear usuario
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { roleId, password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    let role: Role | null = null;
    if (roleId) {
      role = await this.rolesRepository.findOne({ where: { id: roleId } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
    }

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      role: role ?? undefined,
      points: 0, // inicia siempre en 0 por defecto
    });

    const savedUser = await this.usersRepository.save(user);
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  // Listar todos los usuarios
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({ relations: ['role'] });
    return users.map(({ password, ...rest }) => rest);
  }

  // Buscar un usuario por ID
  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Buscar usuario por email (para Auth)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  // Actualizar usuario (permite modificar puntos y otros campos)
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');

    const { roleId, password, activo, points, ...rest } = updateUserDto;

    if (roleId) {
      const role = await this.rolesRepository.findOne({ where: { id: roleId } });
      if (!role) throw new NotFoundException(`Role with ID ${roleId} not found`);
      user.role = role;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (activo !== undefined) {
      user.activo = activo;
    }

    if (points !== undefined) {
      user.points = points;
    }

    Object.assign(user, rest);

    const updatedUser = await this.usersRepository.save(user);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Eliminar usuario
  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }
}
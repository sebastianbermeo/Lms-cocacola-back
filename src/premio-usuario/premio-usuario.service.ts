import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PremioUsuario } from './entities/premio-usuario.entity';
import { CreatePremioUsuarioDto } from './dto/create-premio-usuario.dto';
import { Premio } from 'src/premios/entities/premio.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PremioUsuarioService {
  constructor(
    @InjectRepository(PremioUsuario)
    private readonly premioUsuarioRepo: Repository<PremioUsuario>,

    @InjectRepository(Premio)
    private readonly premiosRepo: Repository<Premio>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async canjearPremio(dto: CreatePremioUsuarioDto) {
    const { userId, premioId } = dto;

    const usuario = await this.usersRepo.findOne({ where: { id: userId } });
    const premio = await this.premiosRepo.findOne({ where: { id: premioId } });

    if (!usuario) throw new BadRequestException('El usuario no existe');
    if (!premio) throw new BadRequestException('El premio no existe');

    const yaCanjeado = await this.premioUsuarioRepo.findOne({
      where: { userId, premioId },
    });

    if (yaCanjeado) {
      throw new BadRequestException('El usuario ya canjeo este premio');
    }

    if (premio.cantidad <= 0) {
      throw new BadRequestException('El premio no tiene existencias');
    }

    if (usuario.points < premio.puntos) {
      throw new BadRequestException('Puntos insuficientes');
    }

    const hoy = new Date();
    const limite = new Date(premio.fechaLimite);

    if (hoy > limite) {
      throw new BadRequestException('El premio esta vencido');
    }

    premio.cantidad -= 1;
    await this.premiosRepo.save(premio);

    usuario.points -= premio.puntos;
    await this.usersRepo.save(usuario);

    const canje = this.premioUsuarioRepo.create({
      userId,
      premioId,
      fechaCanje: new Date(),
    });

    return this.premioUsuarioRepo.save(canje);
  }

  findAll() {
    return this.premioUsuarioRepo.find({
      relations: ['user', 'premio'],
    });
  }

  findByUser(userId: number) {
    return this.premioUsuarioRepo.find({
      where: { userId },
      relations: ['premio'],
    });
  }
}
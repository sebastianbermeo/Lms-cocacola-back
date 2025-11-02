import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailIncludePassword(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto as any);
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    const access_token = await this.jwt.signAsync(payload);
    return { access_token, user };
  }
}
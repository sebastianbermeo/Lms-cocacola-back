import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    if (!user.activo) {
      throw new UnauthorizedException('La cuenta se encuentra deshabilitada')
    }

    const match = await bcrypt.compare(pass, user.password)
    if (!match) throw new UnauthorizedException('Invalid credentials')

    return user
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)
    const payload = { sub: user.id, email: user.email, role: user.role?.name || user.role }
    const access_token = await this.jwtService.signAsync(payload)
    const { password: _, ...userWithoutPassword } = user

    return {
      message: 'Login successful',
      access_token,
      user: {
        id: userWithoutPassword.id,
        name: userWithoutPassword.name,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role?.name || userWithoutPassword.role,
        activo: userWithoutPassword.activo,
        points: userWithoutPassword.points ?? 0,
        imageUrl: userWithoutPassword.imageUrl || '',
      },
    }
  }

  async logout() {
    return { message: 'Logout successful' }
  }
}
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PremioUsuarioService } from './premio-usuario.service';
import { CreatePremioUsuarioDto } from './dto/create-premio-usuario.dto';

@Controller('premio-usuario')
export class PremioUsuarioController {
  constructor(private readonly premioUsuarioService: PremioUsuarioService) {}

  @Post('canjear')
  canjear(@Body() dto: CreatePremioUsuarioDto) {
    return this.premioUsuarioService.canjearPremio(dto);
  }

  @Get('historial/:userId')
  historial(@Param('userId') userId: string) {
    return this.premioUsuarioService.findByUser(+userId);
  }

  @Get()
  findAll() {
    return this.premioUsuarioService.findAll();
  }
}
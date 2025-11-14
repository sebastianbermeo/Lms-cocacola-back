import { Module } from '@nestjs/common';
import { PremioUsuarioService } from './premio-usuario.service';
import { PremioUsuarioController } from './premio-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremioUsuario } from './entities/premio-usuario.entity';
import { Premio } from 'src/premios/entities/premio.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PremioUsuario, Premio, User])
  ],
  controllers: [PremioUsuarioController],
  providers: [PremioUsuarioService],
})
export class PremioUsuarioModule {}
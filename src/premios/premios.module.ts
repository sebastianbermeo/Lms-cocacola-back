import { Module } from '@nestjs/common';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Premio } from './entities/premio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Premio])],
  controllers: [PremiosController],
  providers: [PremiosService],
})
export class PremiosModule {}
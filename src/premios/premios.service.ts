import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Premio } from './entities/premio.entity';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';

@Injectable()
export class PremiosService {
  constructor(
    @InjectRepository(Premio)
    private premiosRepository: Repository<Premio>,
  ) {}

  create(createPremioDto: CreatePremioDto) {
    const premio = this.premiosRepository.create(createPremioDto);
    return this.premiosRepository.save(premio);
  }

  findAll() {
    return this.premiosRepository.find();
  }

  findOne(id: number) {
    return this.premiosRepository.findOne({ where: { id } });
  }

  update(id: number, updatePremioDto: UpdatePremioDto) {
    return this.premiosRepository.update(id, updatePremioDto);
  }

  remove(id: number) {
    return this.premiosRepository.delete(id);
  }
}
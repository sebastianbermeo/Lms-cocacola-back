import { PartialType } from '@nestjs/mapped-types';
import { CreatePremioUsuarioDto } from './create-premio-usuario.dto';

export class UpdatePremioUsuarioDto extends PartialType(CreatePremioUsuarioDto) {}
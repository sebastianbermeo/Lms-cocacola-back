import { IsString, MinLength } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MinLength(2)
  nombre: string;
}

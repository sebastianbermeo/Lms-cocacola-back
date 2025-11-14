import { IsOptional, IsString, IsEmail, IsBoolean, IsNumber, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  @Matches(
    /@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com|live\.com|protonmail\.com|aol\.com)$/i,
    {
      message: 'El correo debe ser un correo real como gmail.com, outlook.com, hotmail.com, yahoo.com, etc.',
    },
  )
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  points?: number;
}
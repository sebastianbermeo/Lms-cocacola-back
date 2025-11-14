import { IsEmail, IsOptional, IsString, MinLength, IsInt, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  @Matches(
    /@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com|live\.com|protonmail\.com|aol\.com)$/i,
    {
      message: 'El correo debe ser un correo real como gmail.com, outlook.com, hotmail.com, etc.',
    },
  )
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsInt()
  roleId?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
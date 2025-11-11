import { IsInt, IsArray, ValidateNested, IsString, IsBoolean, Min } from 'class-validator'
import { Type } from 'class-transformer'

class CreateOpcionDto {
  @IsString()
  texto: string

  @IsBoolean()
  correcta: boolean
}

class CreatePreguntaDto {
  @IsString()
  texto: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones: CreateOpcionDto[]
}

export class CreateQuizDto {
  @IsInt()
  leccionId: number

  @IsInt()
  @Min(0)
  minCorrectas: number

  @IsInt()
  @Min(0)
  puntos: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDto)
  preguntas: CreatePreguntaDto[]
}
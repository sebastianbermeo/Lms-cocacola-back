import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Pregunta } from './pregunta.entity'

@Entity('opcion')
export class Opcion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  texto: string

  @Column({ default: false })
  correcta: boolean

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.opciones, { onDelete: 'CASCADE' })
  pregunta: Pregunta
}
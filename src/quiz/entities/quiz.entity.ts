import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Leccion } from 'src/leccion/entities/leccion.entity'
import { Pregunta } from './pregunta.entity'

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  minCorrectas: number

  @Column({ type: 'int', default: 0 })
  puntos: number

  @OneToOne(() => Leccion, (leccion) => leccion.quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leccion_id' })
  leccion: Leccion

  @OneToOne(() => Pregunta, (pregunta) => pregunta.quiz, { cascade: true })
  preguntas: Pregunta[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
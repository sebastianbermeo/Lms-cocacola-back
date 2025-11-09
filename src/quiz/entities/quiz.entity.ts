import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Leccion } from 'src/leccion/entities/leccion.entity'
import { Pregunta } from './pregunta.entity'

@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  minCorrectas: number

  @ManyToOne(() => Leccion, (leccion) => leccion.quizzes, { onDelete: 'CASCADE' })
  leccion: Leccion

  @OneToMany(() => Pregunta, (pregunta) => pregunta.quiz, { cascade: true })
  preguntas: Pregunta[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
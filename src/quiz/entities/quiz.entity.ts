import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
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
  @JoinColumn()
  leccion: Leccion

  @OneToMany(() => Pregunta, (pregunta) => pregunta.quiz, { cascade: true, eager: true })
  preguntas: Pregunta[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
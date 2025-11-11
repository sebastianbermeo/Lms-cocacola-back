import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Quiz } from './quiz.entity'
import { Opcion } from './opcion.entity'

@Entity('pregunta')
export class Pregunta {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  texto: string

  @ManyToOne(() => Quiz, (quiz) => quiz.preguntas, { onDelete: 'CASCADE' })
  quiz: Quiz

  @OneToMany(() => Opcion, (opcion) => opcion.pregunta, { cascade: true, eager: true })
  opciones: Opcion[]
}
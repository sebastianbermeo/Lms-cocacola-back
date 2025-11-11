import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, CreateDateColumn, UpdateDateColumn
} from 'typeorm'
import { Quiz } from './quiz.entity'
import { User } from 'src/users/entities/user.entity'

@Entity('quiz_resultado')
@Unique(['user', 'quiz'])
export class QuizResultado {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Quiz, { onDelete: 'CASCADE' })
  quiz: Quiz

  @Column({ type: 'int', default: 0 })
  correctas: number

  @Column({ type: 'boolean', default: false })
  aprobado: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
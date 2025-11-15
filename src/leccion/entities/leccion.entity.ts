import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Modulo } from 'src/modulos/entities/modulo.entity'
import { Quiz } from 'src/quiz/entities/quiz.entity'

@Entity('leccion')
export class Leccion {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  titulo: string

  @Column()
  descripcion: string

  @Column({ type: 'text', nullable: true })
  imagen: string | null

  @Column({ type: 'text', nullable: true })
  videoUrl: string | null

  @Column('text', { array: true, nullable: true })
  archivos: string[]

  @Column('text')
  contenidoTexto: string

  @ManyToOne(() => Modulo, (modulo) => modulo.lecciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'modulo_id' })
  modulo: Modulo

  @OneToOne(() => Quiz, (quiz) => quiz.leccion, { cascade: true })
  quiz: Quiz

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
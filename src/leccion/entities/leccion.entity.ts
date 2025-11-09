import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity'

@Entity('leccion')
export class Leccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  imagen: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column('text', { array: true, nullable: true })
  archivos: string[];

  @Column('text')
  contenidoTexto: string;

  @Column({ type: 'int', default: 0 })
  puntos: number;

  @ManyToOne(() => Modulo, (modulo) => modulo.lecciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'modulo_id' })
  modulo: Modulo;

  @OneToMany(() => Quiz, (quiz) => quiz.leccion, { cascade: true })
  quizzes: Quiz[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
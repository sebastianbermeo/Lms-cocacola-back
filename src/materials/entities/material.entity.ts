import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  video: string; // URL del video

  @Column({ type: 'text', nullable: true })
  img: string; // URL de imagen

  @Column({ type: 'text', nullable: true })
  file: string; // URL de archivo

  // ---------- Relaciones ----------
  @Column({ type: 'int' })
  courseId: number;

  @ManyToOne(() => Course, (course) => course.materials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}

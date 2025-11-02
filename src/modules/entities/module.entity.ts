import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('modules')
export class ModuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  video: string;

  @Column({ type: 'text', nullable: true })
  img: string;

  @Column({ type: 'text', nullable: true })
  file: string;

  // ---------- Relaciones ----------
  @OneToMany(() => Course, (course) => course.module, {
    cascade: false,
  })
  courses: Course[];
}
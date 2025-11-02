import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ModuleEntity } from '../../modules/entities/module.entity';
import { Material } from '../../materials/entities/material.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  img: string; // URL de la imagen del curso

  // ---------- Relaciones ----------
  @Column({ type: 'int' })
  moduleId: number;

  @ManyToOne(() => ModuleEntity, (module) => module.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'moduleId' })
  module: ModuleEntity;

  @OneToMany(() => Material, (material) => material.course, {
    cascade: false,
  })
  materials: Material[];
}
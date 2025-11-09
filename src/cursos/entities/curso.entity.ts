import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Modulo } from 'src/modulos/entities/modulo.entity';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  imagen: string;

  @OneToMany(() => Modulo, (modulo) => modulo.curso, { cascade: true })
  modulos: Modulo[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
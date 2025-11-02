import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('rol')
@Unique(['nombre'])
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;
}
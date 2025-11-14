import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Premio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  cantidad: number;

  @Column()
  puntos: number;

  @Column()
  fechaLimite: Date;

  @Column()
  img: string;
}
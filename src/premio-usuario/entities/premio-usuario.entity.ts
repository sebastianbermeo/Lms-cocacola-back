import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Premio } from 'src/premios/entities/premio.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class PremioUsuario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Premio)
  @JoinColumn({ name: 'premioId' })
  premio: Premio;

  @Column()
  premioId: number;

  @Column()
  fechaCanje: Date;
}
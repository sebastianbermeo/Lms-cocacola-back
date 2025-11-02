import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  displayName: string;

  @ManyToOne(() => Rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CursosModule } from './cursos/cursos.module';
import { ModulosModule } from './modulos/modulos.module';
import { LeccionModule } from './leccion/leccion.module';
import { QuizModule } from './quiz/quiz.module';
import { PremiosModule } from './premios/premios.module';
import { PremioUsuarioModule } from './premio-usuario/premio-usuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // host: process.env.DB_HOST,
      // port: Number(process.env.DB_PORT),
      // username: process.env.DB_USER,
      // password: process.env.DB_PASS,
      // database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, // ⚠️ Cambia a true solo en desarrollo local
      logging: true,
    }),
    RolesModule,
    UsersModule,
    AuthModule,
    CursosModule,
    ModulosModule,
    LeccionModule,
    QuizModule,
    PremiosModule,
    PremioUsuarioModule,
  ],
})
export class AppModule {}
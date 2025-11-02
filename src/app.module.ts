import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { MaterialsModule } from './materials/materials.module';
import { ModulesModule } from './modules/modules.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,         // ⚠️ solo para desarrollo
      logging: true,
    }),
    UsersModule,
    MaterialsModule,
    ModulesModule,
    CoursesModule,
    AuthModule,
    RolModule
  ],
})
export class AppModule { }
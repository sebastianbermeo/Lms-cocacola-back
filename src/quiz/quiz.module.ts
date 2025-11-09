import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { QuizService } from './quiz.service'
import { QuizController } from './quiz.controller'
import { Quiz } from './entities/quiz.entity'
import { Pregunta } from './entities/pregunta.entity'
import { Opcion } from './entities/opcion.entity'
import { Leccion } from 'src/leccion/entities/leccion.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Pregunta, Opcion, Leccion])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
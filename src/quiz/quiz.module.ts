import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Quiz } from './entities/quiz.entity'
import { Pregunta } from './entities/pregunta.entity'
import { Opcion } from './entities/opcion.entity'
import { QuizResultado } from './entities/quiz-resultado.entity'
import { QuizService } from './quiz.service'
import { QuizController } from './quiz.controller'
import { Leccion } from 'src/leccion/entities/leccion.entity'
import { User } from 'src/users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Pregunta, Opcion, QuizResultado, Leccion, User])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
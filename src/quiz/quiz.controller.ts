import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { QuizService } from './quiz.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  create(@Body() dto: CreateQuizDto) {
    return this.quizService.create(dto)
  }

  @Get()
  findAll() {
    return this.quizService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizService.update(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.remove(+id)
  }

  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body() payload: { userId: number; answers: { preguntaId: number; opcionId: number }[] },
  ) {
    return this.quizService.submit(+id, payload)
  }
}
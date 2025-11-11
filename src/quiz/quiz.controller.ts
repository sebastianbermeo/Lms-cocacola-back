import { Controller, Get, Post, Body, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common'
import { QuizService } from './quiz.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import type { SubmitPayload } from './quiz.service'

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQuizDto) {
    return this.quizService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.remove(id)
  }

  @Post(':id/submit')
  submit(@Param('id', ParseIntPipe) id: number, @Body() payload: SubmitPayload) {
    return this.quizService.submit(id, payload)
  }

  @Get('resultado/:userId/:quizId')
  getResultado(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('quizId', ParseIntPipe) quizId: number,
  ) {
    return this.quizService.getResultado(userId, quizId)
  }
}
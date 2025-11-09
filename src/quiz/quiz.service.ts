import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Quiz } from './entities/quiz.entity'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { Leccion } from 'src/leccion/entities/leccion.entity'

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
  ) {}

  async create(dto: CreateQuizDto) {
    const leccion = await this.leccionRepo.findOne({ where: { id: dto.leccionId } })
    if (!leccion) throw new NotFoundException('Lección no encontrada')

    const quiz = this.quizRepo.create({
      leccion,
      minCorrectas: dto.minCorrectas,
      preguntas: dto.preguntas.map((p) => ({
        texto: p.texto,
        opciones: p.opciones.map((o) => ({
          texto: o.texto,
          correcta: o.correcta,
        })),
      })),
    })

    return await this.quizRepo.save(quiz)
  }

  findAll() {
    return this.quizRepo.find({
      relations: ['leccion', 'preguntas', 'preguntas.opciones'],
    })
  }

  findOne(id: number) {
    return this.quizRepo.findOne({
      where: { id },
      relations: ['leccion', 'preguntas', 'preguntas.opciones'],
    })
  }

  async update(id: number, dto: UpdateQuizDto) {
    const quiz = await this.findOne(id)
    if (!quiz) throw new NotFoundException('Quiz no encontrado')
    Object.assign(quiz, dto)
    return await this.quizRepo.save(quiz)
  }

  async remove(id: number) {
    const quiz = await this.findOne(id)
    if (!quiz) throw new NotFoundException('Quiz no encontrado')
    await this.quizRepo.remove(quiz)
    return { message: 'Quiz eliminado correctamente' }
  }
}
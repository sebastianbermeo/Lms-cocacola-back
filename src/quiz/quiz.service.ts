import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Quiz } from './entities/quiz.entity'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { Leccion } from 'src/leccion/entities/leccion.entity'
import { Pregunta } from './entities/pregunta.entity'
import { Opcion } from './entities/opcion.entity'
import { QuizResultado } from './entities/quiz-resultado.entity'
import { User } from 'src/users/entities/user.entity'

type SubmitAnswer = { preguntaId: number; opcionId: number }
export type SubmitPayload = { userId: number; answers: SubmitAnswer[] }

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Leccion) private leccionRepo: Repository<Leccion>,
    @InjectRepository(Pregunta) private preguntaRepo: Repository<Pregunta>,
    @InjectRepository(Opcion) private opcionRepo: Repository<Opcion>,
    @InjectRepository(QuizResultado) private resultadoRepo: Repository<QuizResultado>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateQuizDto) {
    const leccion = await this.leccionRepo.findOne({ where: { id: dto.leccionId } })
    if (!leccion) throw new NotFoundException('Leccion no encontrada')

    const quiz = this.quizRepo.create({
      minCorrectas: dto.minCorrectas,
      puntos: dto.puntos ?? 0,
      leccion,
      preguntas: dto.preguntas.map((p) =>
        this.preguntaRepo.create({
          texto: p.texto,
          opciones: p.opciones.map((o) => this.opcionRepo.create(o)),
        }),
      ),
    })

    return this.quizRepo.save(quiz)
  }

  async findAll() {
    return this.quizRepo.find({
      relations: ['leccion', 'preguntas', 'preguntas.opciones'],
      order: { id: 'DESC' },
    })
  }

  async findOne(id: number) {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['leccion', 'preguntas', 'preguntas.opciones'],
    })
    if (!quiz) throw new NotFoundException('Quiz no encontrado')
    return quiz
  }

  async update(id: number, dto: UpdateQuizDto) {
    const quiz = await this.findOne(id)
    Object.assign(quiz, {
      minCorrectas: dto.minCorrectas ?? quiz.minCorrectas,
      puntos: dto.puntos ?? quiz.puntos,
    })
    return this.quizRepo.save(quiz)
  }

  async remove(id: number) {
    const quiz = await this.findOne(id)
    await this.quizRepo.remove(quiz)
    return { message: 'Quiz eliminado correctamente' }
  }

  async submit(quizId: number, payload: SubmitPayload) {
    const { userId, answers } = payload

    const quiz = await this.quizRepo.findOne({
      where: { id: quizId },
      relations: ['preguntas', 'preguntas.opciones'],
    })
    if (!quiz) throw new NotFoundException('Quiz no encontrado')

    const user = await this.userRepo.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundException('Usuario no encontrado')

    const existente = await this.resultadoRepo.findOne({
      where: { user: { id: userId }, quiz: { id: quizId } },
      relations: ['user', 'quiz'],
    })
    if (existente) throw new ForbiddenException('El quiz ya fue realizado por este usuario')

    const opcionesPorPregunta = new Map<number, Opcion>()
    quiz.preguntas.forEach((preg) => {
      preg.opciones.forEach((op) => opcionesPorPregunta.set(op.id, op))
    })

    let correctas = 0
    for (const { preguntaId, opcionId } of answers) {
      const opcion = opcionesPorPregunta.get(opcionId)
      if (opcion && opcion.correcta) correctas += 1
    }

    const aprobado = correctas >= quiz.minCorrectas

    const resultado = this.resultadoRepo.create({
      user,
      quiz,
      correctas,
      aprobado,
    })
    await this.resultadoRepo.save(resultado)

    if (aprobado && quiz.puntos > 0) {
      user.points = (user.points ?? 0) + quiz.puntos
      await this.userRepo.save(user)
    }

    return {
      quizId,
      userId,
      correctas,
      total: quiz.preguntas.length,
      minCorrectas: quiz.minCorrectas,
      aprobado,
      puntosOtorgados: aprobado ? quiz.puntos : 0,
      puntosUsuario: user.points ?? 0,
    }
  }

  async getResultado(userId: number, quizId: number) {
    const resultado = await this.resultadoRepo.findOne({
      where: { user: { id: userId }, quiz: { id: quizId } },
      relations: ['quiz', 'user'],
    })
    if (!resultado) return null
    return resultado
  }
}
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Leccion } from './entities/leccion.entity'
import { Modulo } from 'src/modulos/entities/modulo.entity'
import { supabase } from '../supabase.client'
import { v4 as uuid } from 'uuid'
import type { Express } from 'express'

@Injectable()
export class LeccionService {
  constructor(
    @InjectRepository(Leccion)
    private readonly leccionRepository: Repository<Leccion>,
    @InjectRepository(Modulo)
    private readonly modulosRepository: Repository<Modulo>,
  ) { }

  async createWithFiles(
    body: any,
    archivos: Express.Multer.File[]
  ) {
    const modulo = await this.modulosRepository.findOne({
      where: { id: Number(body.moduloId) },
    })
    if (!modulo) throw new NotFoundException('Modulo not found')

    const archivosUrls: string[] = []

    for (const file of archivos) {
      const ext = file.originalname.split('.').pop()
      const name = `${uuid()}.${ext}`

      await supabase.storage
        .from(process.env.SUPABASE_BUCKET as string)
        .upload(name, file.buffer, { contentType: file.mimetype })

      const url = supabase.storage
        .from(process.env.SUPABASE_BUCKET as string)
        .getPublicUrl(name).data.publicUrl

      archivosUrls.push(url)
    }

    const data = {
      titulo: body.titulo,
      descripcion: body.descripcion,
      contenidoTexto: body.contenidoTexto,
      videoUrl: body.videoUrl || null,
      imagen: body.imagen || null,
      archivos: archivosUrls,
      modulo,
    }

    const leccion = this.leccionRepository.create(data)
    return this.leccionRepository.save(leccion)
  }

  async findAll(): Promise<Leccion[]> {
    return this.leccionRepository.find({ relations: ['modulo', 'quiz'] })
  }

  async findOne(id: number): Promise<Leccion> {
    const leccion = await this.leccionRepository.findOne({
      where: { id },
      relations: ['modulo', 'quiz'],
    })
    if (!leccion) throw new NotFoundException('Leccion not found')
    return leccion
  }

  async update(id: number, body: any): Promise<Leccion> {
    const leccion = await this.findOne(id)
    Object.assign(leccion, body)
    return this.leccionRepository.save(leccion)
  }

  async remove(id: number): Promise<void> {
    const leccion = await this.findOne(id)

    if (leccion.archivos && leccion.archivos.length > 0) {
      const bucket = process.env.SUPABASE_BUCKET as string

      const filesToDelete = leccion.archivos
        .map((url) => url.split('/').pop())
        .filter((name): name is string => typeof name === 'string')

      if (filesToDelete.length > 0) {
        await supabase.storage
          .from(bucket)
          .remove(filesToDelete)
      }
    }

    await this.leccionRepository.remove(leccion)
  }
}
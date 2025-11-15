import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { LeccionService } from './leccion.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import type { Express } from 'express'

@UseGuards(JwtAuthGuard)
@Controller('leccion')
export class LeccionController {
  constructor(private readonly leccionService: LeccionService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'archivos', maxCount: 20 }
    ])
  )
  create(
    @UploadedFiles() files: { archivos?: Express.Multer.File[] },
    @Body() body: any
  ) {
    const archivos = files.archivos || []
    return this.leccionService.createWithFiles(body, archivos)
  }

  @Get()
  findAll() {
    return this.leccionService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leccionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.leccionService.update(+id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leccionService.remove(+id)
  }
}
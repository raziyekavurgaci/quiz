import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOptionDto, UpdateOptionDto } from '../../dto';
import { OptionLabel } from '@prisma/client';

@Injectable()
export class OptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(questionId: string, data: CreateOptionDto) {
    return this.prisma.option.create({
      data: {
        ...data,
        questionId,
      },
    });
  }

  async show(id: string) {
    return this.prisma.option.findUnique({
      where: { id },
    });
  }

  async search(questionId: string, optionText: string) {
    return this.prisma.option.findFirst({
      where: { optionText, questionId },
    });
  }

  async type(questionId: string, optionType: OptionLabel) {
    return this.prisma.option.findFirst({
      where: { questionId, optionType },
    });
  }

  async update(id: string, questionId: string, data: UpdateOptionDto) {
    return this.prisma.option.update({
      where: { id, questionId },
      data,
    });
  }

  async delete(id: string, questionId: string) {
    return this.prisma.option.update({
      where: { id, questionId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto/question.dto';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuestionDto) {
    return this.prisma.question.create({
      data,
    });
  }

  async index() {
    return this.prisma.question.findMany();
  }

  async show(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async search(questionText: string) {
    return this.prisma.question.findUnique({
      where: { questionText },
    });
  }

  async update(id: string, data: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

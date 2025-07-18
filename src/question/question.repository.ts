import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';

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
      where: { id, deletedAt: null },
      include: {
        options: {
          where: {
            deletedAt: null,
          },
        },
      },
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
      include: {
        options: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        options: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async random(skip: number) {
    return this.prisma.question.findFirst({
      where: {
        deletedAt: null,
      },
      skip,
      take: 1,
      include: {
        options: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }
}

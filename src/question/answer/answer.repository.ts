import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    questionId: string,
    optionId: string,
    userId: string,
    isCorrect: boolean,
  ) {
    return this.prisma.answer.create({
      data: { questionId, optionId, userId, isCorrect },
    });
  }

  async index(userId: string) {
    return this.prisma.answer.findMany({
      where: {
        userId,
      },
      include: {
        question: true,
      },
    });
  }

  async show(questionId: string, userId: string) {
    return this.prisma.answer.findFirst({
      where: {
        questionId,
        userId,
      },
      include: {
        question: true,
        option: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.answer.delete({
      where: { id },
    });
  }

  async showCorrectAnswerCount(userId: string) {
    return this.prisma.answer.count({
      where: {
        userId,
        isCorrect: true,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { AnswerRepository } from '../answer/answer.repository';

@Injectable()
export class ScoreService {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async calculateScore(userId: string) {
    const correctAnswerCount =
      await this.answerRepository.showCorrectAnswerCount(userId);
    const totalAnsweredQuestionCount =
      await this.answerRepository.index(userId);

    const score =
      (correctAnswerCount / totalAnsweredQuestionCount.length) * 100;

    return {
      message: `out of ${totalAnsweredQuestionCount.length} questions, you got ${correctAnswerCount} correct answers`,
      data: {
        score: score,
      },
    };
  }
}

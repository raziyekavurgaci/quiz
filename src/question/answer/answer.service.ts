import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnswerRepository } from './answer.repository';
import { OptionService } from '../option/option.service';
import { QuestionService } from '../question.service';

@Injectable()
export class AnswerService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly optionService: OptionService,
    private readonly questionService: QuestionService,
  ) {}

  private async checkExistAnswer(questionId: string, userId: string) {
    const answer = await this.answerRepository.show(questionId, userId);

    return answer ? answer : null;
  }

  async createAnswer(questionId: string, optionId: string, userId: string) {
    const question = await this.questionService.checkQuestionById(questionId);
    if (!question || question.deletedAt) {
      throw new NotFoundException('Question not found');
    }
    const option = await this.optionService.checkOptionById(optionId);

    if (!option || option.deletedAt) {
      throw new NotFoundException('Option not found');
    }

    const existAnswer = await this.checkExistAnswer(questionId, userId);
    if (existAnswer) {
      throw new BadRequestException('Answer already exists');
    }

    const isCorrect = option.isCorrect;

    const answer = await this.answerRepository.create(
      questionId,
      optionId,
      userId,
      isCorrect,
    );
    return {
      message: isCorrect ? 'Answer is right ' : 'Answer is wrong',
      data: answer,
    };
  }

  async indexAnswers(userId: string) {
    const answers = await this.answerRepository.index(userId);
    if (answers.length === 0) {
      throw new NotFoundException('No answers found');
    }
    return {
      message: 'Answers fetched successfully',
      data: answers,
    };
  }

  async showAnswer(questionId: string, userId: string) {
    await this.questionService.showQuestion(questionId);

    const answer = await this.checkExistAnswer(questionId, userId);
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    return {
      message: 'Answer fetched successfully',
      data: answer,
    };
  }

  async deleteAnswer(questionId: string, userId: string) {
    const answer = await this.checkExistAnswer(questionId, userId);

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    await this.answerRepository.delete(answer.id);
    return {
      message: 'Answer deleted successfully',
    };
  }
}

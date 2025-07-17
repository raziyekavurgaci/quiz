import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto, UpdateQuestionDto } from 'src/dto/question.dto';
@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async checkQuestionById(id: string) {
    const question = await this.questionRepository.show(id);
    return question ? question : undefined;
  }

  private async checkQuestionText(questionText: string) {
    const question = await this.questionRepository.search(questionText);
    return question ? question : undefined;
  }

  async createQuestion(data: CreateQuestionDto) {
    const existQuestion = await this.checkQuestionText(data.questionText);
    if (existQuestion) {
      throw new BadRequestException('Question already exists');
    }
    const question = await this.questionRepository.create(data);
    return question;
  }

  async indexQuestions() {
    const questions = await this.questionRepository.index();
    if (questions.length === 0) {
      throw new NotFoundException('No questions found');
    }
    return questions;
  }

  async showQuestion(id: string) {
    const question = await this.checkQuestionById(id);
    if (!question || question.deletedAt) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async updateQuestion(id: string, data: UpdateQuestionDto) {
    const question = await this.checkQuestionById(id);
    if (!question || question.deletedAt) {
      throw new NotFoundException('Question not found');
    }

    const existQuestion = await this.checkQuestionText(data.questionText);
    if (existQuestion) {
      throw new BadRequestException('Question already exists');
    }

    const updatedQuestion = await this.questionRepository.update(id, data);
    return updatedQuestion;
  }

  async deleteQuestion(id: string) {
    const question = await this.checkQuestionById(id);
    if (!question || question.deletedAt) {
      throw new NotFoundException('Question not found');
    }
    await this.questionRepository.delete(id);
    return {
      message: 'Question deleted successfully',
    };
  }
}

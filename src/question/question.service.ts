import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
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
    return {
      message: 'Question created successfully',
      data: question,
    };
  }

  async indexQuestions() {
    const questions = await this.questionRepository.index();
    if (questions.length === 0) {
      throw new NotFoundException('No questions found');
    }
    return {
      message: 'Questions fetched successfully',
      data: questions,
    };
  }

  async showQuestion(id: string) {
    const question = await this.checkQuestionById(id);
    if (!question || question.deletedAt) {
      throw new NotFoundException('Question not found');
    }
    return {
      message: 'Question fetched successfully',
      data: question,
    };
  }

  async updateQuestion(id: string, data: UpdateQuestionDto) {
    const question = await this.checkQuestionById(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.questionText === data.questionText) {
      throw new BadRequestException('Question text cannot be the same');
    }

    const existQuestion = await this.checkQuestionText(data.questionText);
    if (existQuestion) {
      throw new BadRequestException('Question already exists');
    }

    const updatedQuestion = await this.questionRepository.update(id, data);
    return {
      message: 'Question updated successfully',
      data: updatedQuestion,
    };
  }

  async deleteQuestion(id: string) {
    const question = await this.checkQuestionById(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await this.questionRepository.delete(id);
    return {
      message: 'Question deleted successfully',
    };
  }

  async getRandomQuestion() {
    const skip = Math.floor(Math.random() * 10);
    const question = await this.questionRepository.random(skip);
    return {
      message: 'Random question fetched successfully',
      data: question,
    };
  }
}

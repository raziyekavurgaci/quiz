import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OptionRepository } from './option.repository';
import { CreateOptionDto, UpdateOptionDto } from '../../dto';
import { QuestionService } from '../question.service';
import { OptionLabel } from '@prisma/client';
@Injectable()
export class OptionService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly questionService: QuestionService,
  ) {}

  async checkOptionById(id: string) {
    const option = await this.optionRepository.show(id);
    return option ? option : undefined;
  }

  private async checkOptionText(questionId: string, optionText: string) {
    const option = await this.optionRepository.search(questionId, optionText);
    return option ? option : undefined;
  }

  private async checkOptionType(questionId: string, optionType: OptionLabel) {
    const option = await this.optionRepository.type(questionId, optionType);
    return option ? option : undefined;
  }

  private async checkExistQuestionAndOption(questionId: string, id: string) {
    const question = await this.questionService.showQuestion(questionId);
    const option = await this.checkOptionById(id);

    if (!option || option.deletedAt) {
      throw new NotFoundException('Option not found');
    }

    if (option.questionId !== questionId) {
      throw new BadRequestException('Option does not belong to this question');
    }

    return { question: question.data, option };
  }

  async createOption(questionId: string, data: CreateOptionDto) {
    const question = await this.questionService.showQuestion(questionId);

    const existOption = await this.checkOptionText(questionId, data.optionText);

    if (existOption) {
      throw new BadRequestException('Option already exists');
    }

    const existOptionType = await this.checkOptionType(
      questionId,
      data.optionType,
    );

    if (existOptionType) {
      throw new BadRequestException('Option type already exists');
    }

    const hasCorrectOption = question.data.options.some(
      (option) => option.isCorrect,
    );

    if (data.isCorrect && hasCorrectOption) {
      throw new BadRequestException('Only one correct option is allowed');
    }

    const option = await this.optionRepository.create(questionId, data);
    return {
      message: 'Option created successfully',
      option,
    };
  }

  //TODO
  async updateOption(id: string, questionId: string, data: UpdateOptionDto) {
    const updatedOption = await this.optionRepository.update(
      id,
      questionId,
      data,
    );
    return {
      message: 'Option updated successfully',
      data: updatedOption,
    };
  }

  async deleteOption(id: string, questionId: string) {
    await this.checkExistQuestionAndOption(questionId, id);

    await this.optionRepository.delete(id, questionId);

    return {
      message: 'Option deleted successfully',
    };
  }
}

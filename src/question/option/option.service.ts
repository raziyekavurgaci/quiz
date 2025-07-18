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

    const hasCorrectOption = question.data.options.filter(
      (option) => option.isCorrect,
    );

    if (data.isCorrect && hasCorrectOption.length > 0) {
      await this.optionRepository.update(hasCorrectOption[0].id, questionId, {
        isCorrect: false,
      });
    }

    const option = await this.optionRepository.create(questionId, data);
    return {
      message: 'Option created successfully',
      option,
    };
  }

  updateOptionPlain = {
    optionText: async (
      data: string,
      questionId: string,
      id: string,
    ): Promise<void> => {
      const option = await this.checkOptionText(questionId, data);
      if (option) {
        throw new BadRequestException('Option already exists');
      }
      await this.optionRepository.update(id, questionId, {
        optionText: data,
      });
    },

    optionType: async (
      data: OptionLabel,
      questionId: string,
      id: string,
    ): Promise<void> => {
      const option = await this.checkOptionType(questionId, data);
      if (option) {
        throw new BadRequestException('Option type already exists');
      }
      await this.optionRepository.update(id, questionId, {
        optionType: data,
      });
    },

    isCorrect: async (
      data: boolean,
      questionId: string,
      id: string,
    ): Promise<void> => {
      const question = await this.questionService.checkQuestionById(questionId);
      if (!question || question.deletedAt) {
        throw new NotFoundException('Question not found');
      }
      const hasCorrectOption = question.options.filter(
        (option) => option.isCorrect,
      );
      if (data && hasCorrectOption.length > 0) {
        await this.optionRepository.correctTransaction(
          id,
          hasCorrectOption[0].id,
          questionId,
        );
      }
    },
  };

  async updateOption(id: string, questionId: string, data: UpdateOptionDto) {
    await this.checkExistQuestionAndOption(questionId, id);
    const dataKeys = Object.keys(data);

    if (dataKeys.length === 0) {
      throw new BadRequestException('No data provided');
    }

    for (const key of dataKeys) {
      if (key in this.updateOptionPlain) {
        await this.updateOptionPlain[key](data[key], questionId, id);
      }
    }

    return {
      message: 'Option updated successfully',
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

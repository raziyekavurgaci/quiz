import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { QuestionRepository } from './question.repository';
import { OptionService } from './option/option.service';
import { OptionRepository } from './option/option.repository';
import { AnswerService } from './answer/answer.service';
import { AnswerRepository } from './answer/answer.repository';
import { ScoreService } from './score/score.service';

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [
    QuestionService,
    QuestionRepository,
    OptionService,
    OptionRepository,
    AnswerService,
    AnswerRepository,
    ScoreService,
  ],
  controllers: [QuestionController],
})
export class QuestionModule {}

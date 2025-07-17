import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { QuestionRepository } from './question.repository';

@Module({
  imports: [PrismaModule, SharedModule],
  providers: [QuestionService, QuestionRepository],
  controllers: [QuestionController],
})
export class QuestionModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from 'src/dto/question.dto';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RolesGuard } from '../shared/guards';

@Controller('api/questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async createQuestion(@Body() data: CreateQuestionDto) {
    return this.questionService.createQuestion(data);
  }

  @Get()
  async indexQuestions() {
    return this.questionService.indexQuestions();
  }

  @Get(':id')
  async showQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.showQuestion(id);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  async updateQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateQuestionDto,
  ) {
    return this.questionService.updateQuestion(id, data);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  async deleteQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.deleteQuestion(id);
  }
}

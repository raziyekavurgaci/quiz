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
  Req,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
import { OptionService } from './option/option.service';
import { CreateOptionDto, UpdateOptionDto } from '../dto';
import { AnswerService } from './answer/answer.service';
import { ScoreService } from './score/score.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtGuard } from '../shared/guards/jwt.guard';
import { RolesGuard } from '../shared/guards';
import { Request } from 'express';

@Controller('api/questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
    private readonly answerService: AnswerService,
    private readonly scoreService: ScoreService,
  ) {}

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

  @Get('/random')
  async getRandomQuestion() {
    return this.questionService.getRandomQuestion();
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

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/options')
  async createOption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: CreateOptionDto,
  ) {
    return this.optionService.createOption(id, data);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id/options/:optionId')
  async updateOption(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Body() data: UpdateOptionDto,
  ) {
    return this.optionService.updateOption(optionId, id, data);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id/options/:optionId')
  async deleteOption(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
  ) {
    return this.optionService.deleteOption(optionId, id);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/answers')
  async indexAnswers(@Req() req: Request) {
    return this.answerService.indexAnswers(req.user!.userId);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id/answers')
  async showAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.answerService.showAnswer(id, req.user!.userId);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/answers/:optionId')
  async createAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Req() req: Request,
  ) {
    return this.answerService.createAnswer(id, optionId, req.user!.userId);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id/answers')
  async deleteAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.answerService.deleteAnswer(id, req.user!.userId);
  }

  @Roles(Role.STUDENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/score')
  async calculateScore(@Req() req: Request) {
    return this.scoreService.calculateScore(req.user!.userId);
  }

  @Roles(Role.TEACHER)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('/score/:userId')
  async calculateScoreByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.scoreService.calculateScore(userId);
  }
}

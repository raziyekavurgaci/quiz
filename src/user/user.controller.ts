import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../dto/user.dto';
import { Request } from 'express';
import { JwtGuard } from '../shared/guards';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  async getUser(@Req() req: Request) {
    return this.userService.getUser(req.user!.userId);
  }

  @UseGuards(JwtGuard)
  @Patch()
  async updateUser(@Body() data: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(data, req.user!.userId);
  }
}

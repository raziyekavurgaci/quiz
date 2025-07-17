import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @Post('logout')
  async logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization);
  }

  @Post('refresh')
  async refresh(@Headers('authorization') authorization: string) {
    return this.authService.refresh(authorization);
  }

  @Post('logout-all')
  async logoutAll(@Headers('authorization') authorization: string) {
    return this.authService.logoutAll(authorization);
  }
}

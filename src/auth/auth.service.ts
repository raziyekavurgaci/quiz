import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { LoginUserDto, RegisterUserDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async checkUserByUsername(username: string) {
    const user = await this.userRepository.getByUsername(username);
    return user ? user : null;
  }

  async register(data: RegisterUserDto) {
    const user = await this.checkUserByUsername(data.username);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const createdUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const accessToken = this.jwtService.generateAccessToken({
      userId: createdUser.id,
      role: createdUser.role,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: createdUser.id,
      role: createdUser.role,
    });

    return {
      message: 'User registered successfully',
      data: {
        id: createdUser.id,
        username: createdUser.username,
        name: createdUser.name,
        role: createdUser.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginUserDto) {
    const user = await this.checkUserByUsername(data.username);

    if (!user || user.deletedAt) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.id,
      role: user.role,
    });

    return {
      message: 'User logged in successfully',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    return this.jwtService.logout(refreshToken);
  }

  async refresh(refreshToken: string) {
    return this.jwtService.refresh(refreshToken);
  }

  async logoutAll(authorizationHeader: string) {
    return this.jwtService.logoutAll(authorizationHeader);
  }
}

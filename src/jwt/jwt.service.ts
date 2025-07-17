import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { TokenPayload } from '../types/express.d';

@Injectable()
export class JwtService {
  constructor(private readonly prisma: PrismaService) {}

  private extractTokenFromHeader(authorizationHeader: string): string {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid or missing Authorization header',
      );
    }
    return authorizationHeader.split(' ')[1];
  }

  generateAccessToken(payload: TokenPayload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET || 'secret_access_token',
      {
        expiresIn: '15m',
      },
    );
    return accessToken;
  }

  async generateRefreshToken(payload: TokenPayload) {
    const refreshTokenRecord = await this.prisma.token.create({
      data: {
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const refreshToken = jwt.sign(
      { userId: payload.userId, jti: refreshTokenRecord.id },
      process.env.JWT_REFRESH_SECRET || 'secret_refresh_token',
      {
        expiresIn: '7d',
      },
    );

    return refreshToken;
  }

  verifyToken(token: string, secret: string) {
    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }
      return decoded;
    } catch (error) {
      console.log((error as Error).message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(authorizationHeader: string) {
    const refreshToken = this.extractTokenFromHeader(authorizationHeader);

    const decoded = this.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'secret_refresh_token',
    );

    const token = await this.prisma.token.findUnique({
      where: {
        id: decoded.jti,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    if (token.revokedAt) {
      throw new UnauthorizedException('Token has been revoked');
    }

    await this.prisma.token.update({
      where: {
        id: token.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return {
      message: 'Logged out successfully',
    };
  }

  async refresh(authorizationHeader: string) {
    const refreshToken = this.extractTokenFromHeader(authorizationHeader);

    const decoded = this.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'secret_refresh_token',
    );

    const token = await this.prisma.token.findUnique({
      where: {
        id: decoded.jti,
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    if (token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    if (token.revokedAt) {
      throw new UnauthorizedException('Token has been revoked');
    }

    await this.prisma.token.update({
      where: {
        id: token.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const accessToken = this.generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    const renewedRefreshToken = await this.generateRefreshToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return {
      message: 'Token refreshed successfully',
      accessToken,
      renewedRefreshToken,
    };
  }

  async logoutAll(authorizationHeader: string) {
    const refreshToken = this.extractTokenFromHeader(authorizationHeader);

    const decoded = this.verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'secret_refresh_token',
    );

    await this.prisma.token.updateMany({
      where: {
        userId: decoded.userId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return {
      message: 'Logged out from all devices successfully',
    };
  }
}

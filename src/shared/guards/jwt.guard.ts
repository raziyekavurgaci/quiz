import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../jwt/jwt.service';

const secret = process.env.JWT_ACCESS_SECRET || 'secret_access_token';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers?.authorization as string;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verifyToken(token, secret);
      request.user = decoded;
      return true;
    } catch (error) {
      console.log('guard error:' + (error as Error).message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

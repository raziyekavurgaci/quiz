import { Module } from '@nestjs/common';
import { JwtGuard, RolesGuard } from './guards';
import { JwtModule } from '../jwt/jwt.module';
@Module({
  imports: [JwtModule],
  providers: [JwtGuard, RolesGuard],
  exports: [JwtModule, JwtGuard, RolesGuard],
})
export class SharedModule {}

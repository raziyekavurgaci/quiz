import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
@Module({
  imports: [PrismaModule, SharedModule],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}

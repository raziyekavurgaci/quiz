import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async checkUserById(id: string) {
    const user = await this.userRepository.getById(id);
    return user ? user : null;
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    const user = await this.checkUserById(userId);

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    const hasData = data.name !== undefined || data.username !== undefined;

    if (!hasData) {
      throw new BadRequestException('No data to update');
    }
    if (
      (data.name && data.name === user.name) ||
      (data.username && data.username === user.username)
    ) {
      throw new BadRequestException('Input data is the same as before');
    }

    if (data.username) {
      const existUserName = await this.userRepository.getByUsername(
        data.username,
      );
      if (existUserName) {
        throw new BadRequestException('Username already exists');
      }
    }
    const updatedUser = await this.userRepository.updateUser(userId, data);
    const { password, ...userWithoutPassword } = updatedUser;
    return { message: 'User updated successfully', data: userWithoutPassword };
  }

  async getUser(userId: string) {
    const user = await this.checkUserById(userId);

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return { message: 'User fetched successfully', data: userWithoutPassword };
  }
}

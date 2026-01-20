import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entity/user.entity';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const newUser = await this.userRepository.create(userData);

    return newUser;
  }
}

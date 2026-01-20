import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { UserEntity } from '../../domain/entity/user.entity';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Promise<UserEntity[]> {
    return this.userRepository.getAll();
  }
}

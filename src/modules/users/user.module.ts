import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './domain/user.repository';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './infrastructure/sequelize/user.model';
import { GetUserByIdWithPokemonUseCase } from './application/use-cases/get-by-id-user-with-pokemon.use-case';
import { ClientsModule } from 'src/clients/clients.module';
import { UpdatePokemonIdsUseCase } from './application/use-cases/update-pokemon-ids.use-case';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), ClientsModule],
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    GetAllUsersUseCase,
    GetUserByIdWithPokemonUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    UpdatePokemonIdsUseCase,
  ],
})
export class UserModule {}

//Qué hace forFeature: Registra el model, permite inyectarlo, scopeado al módulo

import { PokemonDetails } from 'src/clients/pokemon.client';
import { UserEntity } from './entity/user.entity';

export abstract class UserRepository {
  abstract getAll(): Promise<UserEntity[]>;

  abstract getByIdWithPokemon(
    id: number,
  ): Promise<{ user: UserEntity; pokemon: PokemonDetails[] } | null>;

  abstract create(userData: Omit<UserEntity, 'id'>): Promise<UserEntity>;

  abstract update(
    id: number,
    userData: Partial<UserEntity>,
  ): Promise<UserEntity | null>;

  abstract delete(id: number): Promise<boolean>;

  abstract addPokemonToUser(
    id: number,
    pokemonId: number,
  ): Promise<UserEntity | null>;

  abstract updatePokemonIds(
    id: number,
    pokemonIds: number[],
  ): Promise<UserEntity | null>;

  abstract removePokemonFromUser(
    id: number,
    pokemonId: number,
  ): Promise<UserEntity | null>;
}

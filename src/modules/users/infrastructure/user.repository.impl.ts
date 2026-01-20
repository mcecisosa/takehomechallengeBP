import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../domain/entity/user.entity';
import { UserRepository } from '../domain/user.repository';
import { UserModel } from './sequelize/user.model';
import { PokemonClient, PokemonDetails } from 'src/clients/pokemon.client';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    private pokemonClient: PokemonClient,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    const users = await this.userModel.findAll();

    return users.map(
      (user) =>
        new UserEntity(
          user.id,
          user.username,
          user.email,
          user.password,
          user.pokemonIds,
        ),
    );
  }

  async getByIdWithPokemon(
    id: number,
  ): Promise<{ user: UserEntity; pokemon: PokemonDetails[] } | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;

    const pokemon = await this.pokemonClient.getPokemonDetailsByIds(
      user.pokemonIds,
    );

    const userData = new UserEntity(
      user.id,
      user.username,
      user.email,
      user.password,
      user.pokemonIds,
    );

    return { user: userData, pokemon: pokemon };
  }

  async create(userData: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const { username, email, password, pokemonIds } = userData;

    const newUser = await this.userModel.create({
      username: username,
      email: email,
      password: password,
      pokemonIds: pokemonIds,
    });

    return new UserEntity(
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.password,
      newUser.pokemonIds,
    );
  }

  async update(
    id: number,
    userData: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const { username, email, password, pokemonIds } = userData;

    await this.userModel.update(
      {
        username: username,
        email: email,
        password: password,
        pokemonIds: pokemonIds,
      },
      { where: { id: id } },
    );

    const user = await this.userModel.findByPk(id);

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.password,
      user.pokemonIds,
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { id: id } });

    return result !== 0; //distinto de cero retorna true --->se elimino un registro, si es igual a cero retorna false
  }

  async addPokemonToUser(
    id: number,
    pokemonId: number,
  ): Promise<UserEntity | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;

    //prevent duplicates
    if (!user.pokemonIds.includes(pokemonId)) {
      user.pokemonIds.push(pokemonId);
      await user.save();
    }
    return user;
  }

  async updatePokemonIds(
    id: number,
    pokemonIds: number[],
  ): Promise<UserEntity | null> {
    await this.userModel.update(
      {
        pokemonIds: pokemonIds,
      },
      { where: { id: id } },
    );

    const user = await this.userModel.findByPk(id);

    if (!user) return null;

    return user;
  }

  async removePokemonFromUser(
    id: number,
    pokemonId: number,
  ): Promise<UserEntity | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) return null;

    user.pokemonIds = user.pokemonIds.filter((id) => id !== pokemonId);
    await user.save();

    return user;
  }
}

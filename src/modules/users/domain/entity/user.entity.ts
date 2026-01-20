export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
    public readonly pokemonIds: number[],
  ) {}
}

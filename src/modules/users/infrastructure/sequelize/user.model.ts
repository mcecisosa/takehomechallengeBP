import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Table, Column, Model, DataType } from 'sequelize-typescript';
import type { CreationOptional } from 'sequelize';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: true,
    defaultValue: [],
  })
  declare pokemonIds: number[];
}

//declare le dice a TypeScript: “Esta propiedad existe en runtime no la inicialices acá, confía en mí”

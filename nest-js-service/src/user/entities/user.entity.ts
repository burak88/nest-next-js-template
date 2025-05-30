import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string = undefined!; // UUIDv4 olarak otomatik oluşturulacak

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string; 

  @Default('user')
  @Column({
    type: DataType.ENUM('user', 'admin'),
  })
  role: 'user' | 'admin';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken: string | null;
}

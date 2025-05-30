import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'; // Bcrypt kütüphanesini import ediyoruz
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) // Sequelize modelini enjekte ediyoruz
    private readonly userModel: typeof User, // Bu model, User entity'si ile ilişkilendirilecek
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const existing = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword; // Şifreyi hashliyoruz
    return this.userModel.create(createUserDto as any); 
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id); // Sequelize ile ID'ye göre bul
  }

  async updateRefreshToken(userId: string, hashedToken: string) {
    await this.userModel.update(
      {
        refreshToken: hashedToken,
      },
      {
        where: { id: userId },
      },
    );
  }

  async removeRefreshToken(userId: string) {
    const [affectedCount] = await this.userModel.update(
      {
        refreshToken: null,
      },
      {
        where: { id: userId },
      },
    );

    if (affectedCount === 0) {
      throw new Error(`No user found with id: ${userId}`);
    }
  }
}

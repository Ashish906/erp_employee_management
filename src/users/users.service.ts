import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import UserEntity from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity
  ) {}

  async getMyProfile(userId: string) {
    return await this.userModel.findOne({
      attributes: ['id', 'name', 'email', 'role'],
      where: {
        id: userId
      }
    })
  }
}

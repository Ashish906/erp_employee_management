import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/sequelize';
import UserEntity from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Transaction } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserEntity)
    private readonly userEntityModel: typeof UserEntity,
  ) {}


  async login(body: LoginDto) {
    const user = await this.userEntityModel.findOne({
      include: [
        {
          attributes: ['id'],
          association: 'employee'
        }
      ],
      where: {
        email: body.email,
        is_active: true
      }
    });
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new HttpException('Unauthorized', HttpStatus.BAD_REQUEST);
    }

    const { access_token, refresh_token } = await this.getTokens(user);
    const hashedRT = await bcrypt.hash(refresh_token, 10);

    await user.update({
      refresh_token: hashedRT
    });

    return {
      access_token,
      refresh_token
    }
  }

  async register(body: RegisterDto, transaction?: Transaction) {
    const existingUser = await this.userEntityModel.findOne({
      where: {
        email: body.email
      }
    });
    if(existingUser) {
      throw new HttpException('User already exists', HttpStatus.AMBIGUOUS);
    }

    body.password = await bcrypt.hash(body.password, 10);
    const newUser = await this.userEntityModel.create({...body}, { transaction });

    delete newUser.password;

    return newUser;
  }

  async refreshToken(payload: any) {
    const { access_token, refresh_token } = await this.getTokens(payload);
    const hashedRT = await bcrypt.hash(refresh_token, 10);

    await this.userEntityModel.update({
      refresh_token: hashedRT
    }, {
      where: {
        id: payload.sub
      }
    });

    return {
      access_token,
      refresh_token
    }
  }

  async getTokens(user: UserEntity) {
    const payload = {
      sub: user.id,
      role: user.role,
      employee_id: user?.employee?.id
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE
    });

    const refreshToken = await this.jwtService.signAsync({ sub: user.id }, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
}

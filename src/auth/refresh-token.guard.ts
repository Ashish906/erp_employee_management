import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import UserEntity from '../users/entities/user.entity';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new BadRequestException();
    }
    let payload = null;
    try {
      payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );
    } catch {
      throw new BadRequestException();
    }
    const user = await this.userModel.findOne({
      attributes: ['id', 'name', 'email', 'role', 'refresh_token'],
      include: [
        {
          association: 'employee',
          attributes: ['id']
        }
      ],
      where: {
        id: payload.sub,
        is_active: true
      }
    });
    if(!user) {
      throw new BadRequestException();
    }

    const isMatch = await bcrypt.compare(token, user.refresh_token);
    if(!isMatch) {
      throw new BadRequestException();
    }

    request['user'] = { ...payload, ...user.toJSON() };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import UserEntity from '../users/entities/user.entity';
import { Role } from '../users/enum/role.enum';
import { ROLES_KEY } from './decorator/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity,
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
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
      throw new UnauthorizedException();
    }
    const user = await this.userModel.findOne({
      attributes: ['id', 'name', 'email', 'role'],
      where: {
        id: payload.sub,
        is_active: true
      }
    });
    if(!user) {
      throw new UnauthorizedException();
    }

    // To check authorization
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if(requiredRoles?.length && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException();
    }

    request['user'] = { ...payload, ...user.toJSON() };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

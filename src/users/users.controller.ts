import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my-profile')
  getMayProfile(@Request() req: any) {
    return this.usersService.getMyProfile(req.user?.sub);
  }
}

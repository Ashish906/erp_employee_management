import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import PositionEntity from './entities/position.entity';
import UserEntity from '../users/entities/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PositionEntity,
      UserEntity
    ])
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}

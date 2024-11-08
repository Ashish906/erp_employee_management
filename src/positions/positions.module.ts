import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import PositionEntity from './entities/position.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PositionEntity
    ])
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}

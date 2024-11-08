import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectModel } from '@nestjs/sequelize';
import PositionEntity from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(PositionEntity)
    private readonly positionModel: typeof PositionEntity,
  ) {}

  async create(createPositionDto: CreatePositionDto) {
    return await this.positionModel.create({ ...createPositionDto });
  }

  async findAll() {
    return await this.positionModel.findAll({
      attributes: ['id', 'name']
    });
  }

  async findOne(id: number) {
    const positionInfo = await this.positionModel.findOne({
      where: {
        id
      }
    });
    if (!positionInfo) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }

    return positionInfo;
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const positionInfo = await this.positionModel.findOne({
      where: {
        id
      }
    });
    if (!positionInfo) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }

    await positionInfo.update(updatePositionDto);
    return positionInfo;
  }

  async remove(id: number) {
    const positionInfo = await this.positionModel.findOne({
      where: {
        id
      }
    });
    if (!positionInfo) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }

    await positionInfo.destroy();
    return 'Position deleted sucessfully!';
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectModel } from '@nestjs/sequelize';
import PositionEntity from './entities/position.entity';
import { Op } from 'sequelize';
import { CommonQueryDto } from '../common/dto/common-query.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(PositionEntity)
    private readonly positionModel: typeof PositionEntity,
  ) {}

  async create(createPositionDto: CreatePositionDto) {
    const existingPos = await this.positionModel.findOne({
      where: {
        name: createPositionDto.name
      }
    });
    if(existingPos) {
      throw new BadRequestException('Position already exists');
    }

    return await this.positionModel.create({ ...createPositionDto });
  }

  async findAll(query: CommonQueryDto) {
    const { page, size } = query;

    return await this.positionModel.findAll({
      attributes: ['id', 'name'],
      limit: size,
      offset: page && size ? (page - 1) * size : 0,
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

    const existingPos = await this.positionModel.findOne({
      where: {
        id: {
          [Op.ne]: id
        },
        name: updatePositionDto.name
      }
    });
    if(existingPos) {
      throw new BadRequestException('Position already exists');
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

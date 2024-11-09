import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../users/enum/role.enum';
import { CommonQueryDto } from '../common/dto/common-query.dto';

@Roles(Role.admin)
@UseGuards(AuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Get()
  findAll(@Query() query: CommonQueryDto) {
    return this.positionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}

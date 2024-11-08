import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import EmployeeEntity from './entities/employee.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmployeeEntity
    ])
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../users/enum/role.enum';

@UseGuards(AuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(Role.admin)
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  // If requested user is employee then he can only access his children employees
  @Get()
  findAll(@Request() req) {
    return this.employeesService.findAll(req.user);
  }

  @Roles(Role.admin)
  @Get('organogram/:employee_id')
  organogram(@Param('employee_id', ParseIntPipe) employee_id: number) {
    return this.employeesService.getOrganogram(employee_id);
  }

  @Roles(Role.admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.employeesService.findOne(+id);
  }

  @Roles(Role.admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Roles(Role.admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.employeesService.remove(+id);
  }
}

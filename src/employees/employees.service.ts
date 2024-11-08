import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/sequelize';
import EmployeeEntity from './entities/employee.entity';
import { Op, Transaction } from 'sequelize';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(EmployeeEntity)
    private readonly employeeModel: typeof EmployeeEntity,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { supervisor_id } = createEmployeeDto;
    if(supervisor_id) {
      const supervisorInfo = await this.employeeModel.findOne({
        where: {
          id: supervisor_id
        }
      });
      if(!supervisorInfo) {
        throw new NotFoundException(`Supervisor with id ${supervisor_id} not found`);
      }

      (<any>createEmployeeDto).left_boundary = supervisorInfo.right_boundary;
      (<any>createEmployeeDto).right_boundary = supervisorInfo.right_boundary + 1;
    } else {
      const rightestEmployee = await this.employeeModel.findOne({
        order: [
          ['right_boundary', 'desc']
        ]
      });

      (<any>createEmployeeDto).left_boundary = (rightestEmployee?.right_boundary ?? 0) + 1;
      (<any>createEmployeeDto).right_boundary = (rightestEmployee?.right_boundary ?? 0) + 2;
    }

    return await this.employeeModel.sequelize.transaction(async (transaction: Transaction) => {
      const newEmployee = await this.employeeModel.create({ ...createEmployeeDto }, { transaction });

      // To adjust other employees boundaries as well as supervisor
      await this.incrementLeftBoundary(newEmployee, 2, transaction);
      // This also increment supervisor right boundary
      await this.incrementRightBoundary(newEmployee, 2, transaction);

      return newEmployee;
    });
  }

  async findAll() {
    return await this.employeeModel.findAll({
      attributes: ['id', 'name', 'position_id'],
      include: [
        {
          association: 'position',
          attributes: ['id', 'name']
        }
      ]
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeModel.findOne({
      attributes: ['id', 'name', 'position_id'],
      include: [
        {
          association: 'position',
          attributes: ['id', 'name']
        }
      ],
      where: {
        id
      }
    });
    if(!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeModel.findOne({
      where: {
        id
      }
    });
    if(!employee) throw new NotFoundException(`Employee with id ${id} not found`);

    const transaction = await this.employeeModel.sequelize.transaction();
    try {
      if(employee.supervisor_id !== updateEmployeeDto.supervisor_id) {
        const childIds = (await this.employeeModel.findAll({
          where: {
            left_boundary: {
              [Op.between]: [employee.left_boundary, employee.right_boundary]
            }
          }
        })).map(item => item.id);

        if(employee.supervisor_id) {
          // Adjusting previous position
          const difference = (1 + employee.right_boundary - employee.left_boundary) * -1;
          const extra = {
            id: {
              [Op.notIn]: childIds
            }
          }
          await this.incrementLeftBoundary(employee, difference, transaction, extra);
          await this.incrementRightBoundary(employee, difference, transaction, extra);
        }

        let newPosDiff = 0;
        if(updateEmployeeDto.supervisor_id) {
          const newSupervisor = await this.employeeModel.findOne({
            where: {
              id: updateEmployeeDto.supervisor_id
            },
            transaction
          });
          if(!newSupervisor) {
            throw new NotFoundException(`Supervisor with id ${id} not found`);
          }

          newPosDiff = newSupervisor?.right_boundary - employee.left_boundary; // Since left boundary == supervisor right boundary
        } else {
          const maxRight = await this.employeeModel.findOne({
            order: [
              ['right_boundary', 'desc']
            ],
            transaction
          });
          newPosDiff = 1 + maxRight?.right_boundary - employee.left_boundary;
        }

        await this.employeeModel.increment('left_boundary', {
          where: {
            id: {
              [Op.in]: childIds
            }
          },
          by: newPosDiff,
          transaction
        });
        await this.employeeModel.increment('right_boundary', {
          where: {
            id: {
              [Op.in]: childIds
            }
          },
          by: newPosDiff,
          transaction
        });
        (<any>updateEmployeeDto).left_boundary = employee.left_boundary + newPosDiff;
        (<any>updateEmployeeDto).right_boundary = employee.right_boundary + newPosDiff;
        await employee.update(updateEmployeeDto, { transaction });

        const leftRightDiff = 1 + employee.right_boundary - employee.left_boundary;
        await this.incrementLeftBoundary(employee, leftRightDiff, transaction);
        await this.incrementRightBoundary(employee, leftRightDiff, transaction);

        return 'Employee updated successfully!';
      }
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    const employee = await this.employeeModel.findOne({
      where: {
        id
      }
    });
    if(!employee) throw new NotFoundException(`Employee with id ${id} not found`);

    return await this.employeeModel.sequelize.transaction(async (transaction: Transaction) => {
      await employee.destroy({ transaction });

      const difference = (1 + employee.right_boundary - employee.left_boundary) * -1;
      const childIds = (await this.employeeModel.findAll({
        where: {
          left_boundary: {
            [Op.between]: [employee.left_boundary, employee.right_boundary]
          }
        }
      })).map(item => item.id);
      const extra = {
        id: {
          [Op.notIn]: childIds
        }
      }
      await this.incrementLeftBoundary(employee, difference, transaction, extra);
      await this.incrementRightBoundary(employee, difference, transaction, extra);
      if(employee.right_boundary - employee.left_boundary > 1) {
        const maxRight = await this.employeeModel.findOne({
          order: [
            ['right_boundary', 'desc']
          ],
          transaction
        });
        const newPosDiff = maxRight?.right_boundary - employee.left_boundary;
        await this.employeeModel.increment('left_boundary', {
          where: {
            id: {
              [Op.in]: childIds
            }
          },
          by: newPosDiff,
          transaction
        });
        await this.employeeModel.increment('right_boundary', {
          where: {
            id: {
              [Op.in]: childIds
            }
          },
          by: newPosDiff,
          transaction
        });

        // Maybe we can remove supervisor of his children
        await this.employeeModel.update({
          supervisor_id: null
        }, {
          where: {
            supervisor_id: employee.id
          },
          transaction
        });
      }

      return 'Employee deleted successfully';
    });
  }

  async incrementLeftBoundary(employee: EmployeeEntity, by: number, transaction: Transaction, extra={}) {
    await this.employeeModel.increment('left_boundary', {
      where: {
        left_boundary: {
          [Op.gt]: employee.left_boundary
        },
        ...extra
      },
      by,
      transaction
    });
  }

  async incrementRightBoundary(employee: EmployeeEntity, by: number, transaction: Transaction, extra={}) {
    await this.employeeModel.increment('right_boundary', {
      where: {
        right_boundary: {
          [Op.gte]: employee.left_boundary
        },
        ...extra
      },
      by,
      transaction
    });
  }

  async getOrganogram(employee_id: number) {
    const employee = await this.employeeModel.findOne({
      where: {
        id: employee_id
      }
    });
    if(!employee) throw new NotFoundException(`Employee with id ${employee_id} not found`);

    const childEmployees = await this.employeeModel.findAll({
      include: [
        {
          association: 'position',
          attributes: ['id', 'name']
        }
      ],
      where: {
        left_boundary: {
          [Op.gt]: employee.left_boundary
        },
        right_boundary: {
          [Op.lt]: employee.right_boundary
        }
      },
      order: [
        ['left_boundary', 'asc']
      ]
    });
    const tree = [];
    const tracker = {};
    for (const employee of childEmployees) {
      tracker[employee.id] = { ...employee, children: [] };
    }

    for (const employee of childEmployees) {
      const trac = tracker[employee.id];
      tree.push(trac);

      if(trac.supervisor_id) {
        tracker[trac.supervisor_id]?.children.push(trac);
      }
    }

    return tree;
  }
}

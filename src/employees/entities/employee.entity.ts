import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import PositionEntity from '../../positions/entities/position.entity';

@Table({
  tableName: 'employees',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
})
class EmployeeEntity extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => PositionEntity)
  @Column({ type: DataType.INTEGER, allowNull: false })
  position_id: number;

  @ForeignKey(() => EmployeeEntity)
  @Column({ type: DataType.INTEGER })
  supervisor_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  left_boundary: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  right_boundary: number;

  @BelongsTo(() => PositionEntity, { foreignKey: 'position_id' })
  position: PositionEntity;
}

export default EmployeeEntity;
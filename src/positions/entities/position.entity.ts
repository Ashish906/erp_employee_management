import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'positions',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
class PositionEntity extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  id?: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;
}

export default PositionEntity;
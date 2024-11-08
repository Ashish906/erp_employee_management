import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Role } from '../enum/role.enum';
import EmployeeEntity from '../../employees/entities/employee.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
class UserEntity extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true
  })
  id?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ defaultValue: true })
  is_active?: boolean;

  @Column({ type: DataType.ENUM(...Object.values(Role)), allowNull: false })
  role: Role;

  @Column({ type: DataType.STRING })
  refresh_token: string; // One user can login with a single device

  @HasOne(() => EmployeeEntity, { foreignKey: 'user_id' })
  employee?: EmployeeEntity;
}

export default UserEntity;
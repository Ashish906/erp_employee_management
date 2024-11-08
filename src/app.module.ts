import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import { EmployeesModule } from './employees/employees.module';
import { PositionsModule } from './positions/positions.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

const envPath = join(__dirname,'..', (process.env.NODE_ENV !== 'production' ? `.env.${process.env.NODE_ENV}` : '.env')).trim();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      sync: {
        alter: true
      },
      synchronize: true,
      autoLoadModels: true,
    }),
    EmployeesModule,
    PositionsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

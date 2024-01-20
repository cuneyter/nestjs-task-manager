import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'taskmanager',
      password: 'taskmanager',
      database: 'taskmanager',
      entities: [Task],
      // autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}

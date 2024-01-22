import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string): Promise<Task> {
    const task: Task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    // Preferred method is `delete` over `remove` because it is more efficient
    const result = await this.tasksRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // const task: Task = await this.getTaskById(id);
    //
    // if (!task) {
    //   throw new NotFoundException(`Task with ID "${id}" not found`);
    // }
    // await this.tasksRepository.remove(task);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task: Task = await this.getTaskById(id);

    task.status = status;
    return await this.tasksRepository.save(task);
  }
}

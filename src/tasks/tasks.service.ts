import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
  ) {}

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTasksWithFilters(filterDto: GetTasksFilterDto) {
  //   const { status, search } = filterDto;
  //   const tasks = this.getAllTasks();
  //
  //   if (!status && !search) {
  //     return tasks;
  //   }
  //
  //   const lowerCasedStatus = status?.toLowerCase();
  //
  //   return tasks.filter((task) => {
  //     const taskTitleLower = task.title.toLowerCase();
  //     const taskDescLower = task.description.toLowerCase();
  //
  //     const statusMatch = lowerCasedStatus
  //       ? task.status.toLowerCase() === lowerCasedStatus
  //       : true;
  //     const searchMatch = search
  //       ? taskTitleLower.includes(search.toLowerCase()) ||
  //         taskDescLower.includes(search.toLowerCase())
  //       : true;
  //
  //     return statusMatch && searchMatch;
  //   });
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task: Task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
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

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}

import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    const tasks = this.getAllTasks();

    if (!status && !search) {
      return tasks;
    }

    const lowerCasedStatus = status?.toLowerCase();

    return tasks.filter((task) => {
      const taskTitleLower = task.title.toLowerCase();
      const taskDescLower = task.description.toLowerCase();

      const statusMatch = lowerCasedStatus
        ? task.status.toLowerCase() === lowerCasedStatus
        : true;
      const searchMatch = search
        ? taskTitleLower.includes(search.toLowerCase()) ||
          taskDescLower.includes(search.toLowerCase())
        : true;

      return statusMatch && searchMatch;
    });
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}

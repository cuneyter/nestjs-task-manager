import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

export class TasksRepository extends Repository<Task> {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {
    super(
      tasksRepository.target,
      tasksRepository.manager,
      tasksRepository.queryRunner,
    );
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    console.log('Filter DTO:', filterDto); // Debug: Log the received filterDto

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
      console.log('Status Filter Applied:', status); // Debug: Log the status filter
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
      console.log('Search Filter Applied:', search); // Debug: Log the search filter
    }

    const sql = query.getSql();
    console.log('SQL Query:', sql); // Log the actual SQL query


    const tasks: Task[] = await query.getMany();
    console.log('Tasks:', tasks); // Debug: Log the retrieved tasks
    return tasks;
  }


  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = this.create({
      title,
      description,
    });

    await this.save(task);
    return task;
  }
}

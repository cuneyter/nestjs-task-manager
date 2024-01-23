import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  id: 'test_user_id',
  username: 'Test user',
  password: 'test_pass',
  tasks: [],
};

const mockTask = {
  id: 'test_task_id',
  title: 'Test task',
  description: 'Test desc',
  status: 'OPEN',
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and return the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();

      // Arrange
      tasksRepository.getTasks.mockResolvedValue(['sample task']);

      // Act
      const result: Task[] = await tasksService.getTasks(null, mockUser);

      // Assert
      expect(result).toEqual(['sample task']);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne and return the result', async () => {
      tasksRepository.findOne.mockResolvedValue(mockTask);

      const result: Task = await tasksService.getTaskById(
        mockTask.id,
        mockUser,
      );

      expect(result).toEqual(mockTask);
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id, user: mockUser },
      });
    });

    it('calls TaskRepository.findOne and handles error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      await expect(
        tasksService.getTaskById(mockTask.id, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('calls TaskRepository.createTask and return the result', async () => {
      // Arrange
      const mockCreateTaskDto = {
        title: 'Test task',
        description: 'Test desc',
      };
      tasksRepository.createTask.mockResolvedValue(mockTask);

      // Act
      const result: Task = await tasksService.createTask(
        mockCreateTaskDto,
        mockUser,
      );

      // Assert
      expect(result).toEqual(mockTask);
      expect(tasksRepository.createTask).toHaveBeenCalledWith(
        mockCreateTaskDto,
        mockUser,
      );
    });
  });

  describe('deleteTaskById', () => {
    it('calls TaskRepository.deleteTaskById to delete a task', async () => {
      // Arrange
      tasksRepository.delete.mockResolvedValue({ affected: 1 });

      // Act
      await tasksService.deleteTaskById(mockTask.id, mockUser);

      // Assert
      expect(tasksRepository.delete).toHaveBeenCalledWith({
        id: mockTask.id,
        user: mockUser,
      });
    });
  });

  describe('updateTaskStatus', () => {
    it('calls TasksService.getTaskById and TasksRepository.save to update a task', async () => {
      // Arrange
      tasksService.getTaskById = jest.fn().mockResolvedValue(mockTask);
      tasksRepository.save.mockResolvedValue(mockTask);

      // Act
      const result = await tasksService.updateTaskStatus(
        mockTask.id,
        TaskStatus.IN_PROGRESS, // new status
        mockUser,
      );

      // Assert
      expect(tasksService.getTaskById).toHaveBeenCalledWith(
        mockTask.id,
        mockUser,
      );
      expect(tasksRepository.save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});

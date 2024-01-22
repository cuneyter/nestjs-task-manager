import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TaskStatus } from './task.model';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'OPEN' })
  status: TaskStatus;

  @ManyToOne(() => User, (user: User) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}

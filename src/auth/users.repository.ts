import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ErrorType } from '../utils/errors/error-types.enum';
import { ErrorMessages } from '../utils/errors/error-messages.util';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export class UsersRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(
      usersRepository.target,
      usersRepository.manager,
      usersRepository.queryRunner,
    );
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: User = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException({
          type: ErrorType.DUPLICATE_USERNAME,
          message: ErrorMessages[ErrorType.DUPLICATE_USERNAME],
          error: error.message,
        });
      } else {
        throw new InternalServerErrorException({
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: ErrorMessages[ErrorType.INTERNAL_SERVER_ERROR],
        });
      }
    }
  }
}

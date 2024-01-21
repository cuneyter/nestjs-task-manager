import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      await this.usersRepository.createUser(authCredentialsDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
}

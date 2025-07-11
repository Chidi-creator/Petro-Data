import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { User } from 'src/common/schemas/users.schema';
import { nationalisePhoneNumber } from 'src/utils/phone.number';
import { CustomHttpException } from 'src/common/filters/customException.filter';
import * as bcrypt from 'bcryptjs';
import { IUser } from 'src/common/schemas/types/Users';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  }: RegisterUserDto): Promise<User> {
    await this.checkExistingUser(email, phoneNumber);

    const formattedPhoneNumber = nationalisePhoneNumber(phoneNumber);

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload: Partial<IUser> = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber: formattedPhoneNumber,
    };

    try {
      const user = await this.userRepository.create(payload);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new CustomHttpException(
        'Error creating user: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getAllUsers({}, options): Promise<User[]> {

    try {
      const users = await this.userRepository.findAll({}, options);
      return users.map(user => {
        user.password = ''; // Remove password from the response
        return user;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new CustomHttpException(
        'Error fetching users: ' + (error?.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async checkExistingUser(
    email: string,
    phoneNumber: string,
  ): Promise<void> {
    const [emailExists, phoneNumberExists] = await Promise.all([
      this.userRepository.findOneOrNull({ email }),
      this.userRepository.findOneOrNull({ phoneNumber }),
    ]);

    if (emailExists) {
      throw new CustomHttpException(
        'Email already exists',
        HttpStatus.CONFLICT,
      );
    }

    if (phoneNumberExists) {
      throw new CustomHttpException(
        'Phone number already exists',
        HttpStatus.CONFLICT,
      );
    }
  }

  public async getUserProfile(userId: string): Promise<User> {
    try {
      const profile = await this.userRepository.findById(userId);

      if (!profile) throw new NotFoundException('No profile with the given id');

      profile.password = '';

      return profile;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new CustomHttpException(
          'No user found with the given ID',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new CustomHttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      email: email.toLocaleLowerCase(),
    });

    if (user === null) {
      throw new CustomHttpException(
        'User with email is not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomHttpException(
        'Invalid password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    user.password = '';
    return user;
  }
}

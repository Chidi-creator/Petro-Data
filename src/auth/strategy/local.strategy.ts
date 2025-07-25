import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/common/schemas/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      return await this.usersService.validateUser(
        email.toLowerCase(),
        password,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}

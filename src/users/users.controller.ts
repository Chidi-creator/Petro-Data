import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/user.dto';
import { SuccessMessage } from 'src/decorators/successMessage.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/config/constants';
import { RoleGuard } from 'src/auth/guards/role.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @SuccessMessage('User registered successfully')
  @Post('register')
  async registerUser(@Body(ValidationPipe) dto: RegisterUserDto) {
    return this.userservice.registerUser(dto);
  }

  @SuccessMessage('Users fetched successfully')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getAllUsers() {
    return this.userservice.getAllUsers();
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AllUsersQueryDto, RegisterUserDto } from './dto/user.dto';
import { SuccessMessage } from 'src/decorators/successMessage.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import {
  DEFAULT_PAGINATION_LIMIT,
  PaginationOptions,
  Role,
} from 'src/common/config/constants';
import { RoleGuard } from 'src/auth/guards/role.guards';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @ApiTags('Users')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request — invalid data or user already exists',
  })
  @ApiBody({ type: RegisterUserDto })
  @SuccessMessage('User registered successfully')
  @Post('register')
  async registerUser(@Body(ValidationPipe) dto: RegisterUserDto) {
    return this.userservice.registerUser(dto);
  }

  @ApiTags('Users')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all users (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — not an admin or unauthenticated',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
    example: 1,
    description: 'Pagination page number',
  })
  @SuccessMessage('Users fetched successfully')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  async getAllUsers(@Query() query: AllUsersQueryDto) {
    const limit = DEFAULT_PAGINATION_LIMIT;
    const skip = (query.page - 1) * limit;

    const options: PaginationOptions = { skip, limit };

    return this.userservice.getAllUsers({}, options);
  }
}

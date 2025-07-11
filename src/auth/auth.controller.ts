import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/common/schemas/users.schema';
import { SuccessMessage } from 'src/decorators/successMessage.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @ApiTags('Authentication')
@ApiOperation({ summary: 'Login user with email and password' })
@ApiResponse({ status: 200, description: 'User successfully logged in' })
@ApiResponse({ status: 401, description: 'Unauthorized — invalid credentials' })
@ApiBody({ type: LoginDto }) 
    @SuccessMessage('User logged in successfully')
    @UseGuards(LocalGuard)
    @Post('login')
    async loginUser(@CurrentUser() user: User){
        return this.authService.loginUser(user);
    }
    
}

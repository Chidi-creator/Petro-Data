import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/common/schemas/users.schema';
import { SuccessMessage } from 'src/decorators/successMessage.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @SuccessMessage('User logged in successfully')
    @UseGuards(LocalGuard)
    @Post('login')
    async loginUser(@CurrentUser() user: User){
        return this.authService.loginUser(user);
    }
    

}

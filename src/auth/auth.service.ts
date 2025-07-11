import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/common/config/constants';
import { User } from 'src/common/schemas/users.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
       private readonly jwtService: JwtService
    ){}

    async loginUser(user: User): Promise<{user: User, token: string}> {
        const payload: TokenPayload = {userId: user._id.toString()}
        const expiresIn = this.configService.get<number>('USER_JWT_EXPIRATION') as number || 3600
        const token = this.jwtService.sign(payload, {expiresIn});

        return{user, token}

    }
}

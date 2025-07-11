import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "src/common/config/constants";
import { User } from "src/common/schemas/users.schema";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.get<string>('JWT_SECRET') as string,
        })
    }

    async validate({userId}: TokenPayload): Promise<User> {
        try {
            return await this.usersService.getUserProfile(userId);
        } catch (error) {
               throw new UnauthorizedException(error.message);
        }
    }


}
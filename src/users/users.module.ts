import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema, { User } from 'src/common/schemas/users.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
      ])
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    JwtStrategy,
    JwtGuard

  ],
  exports: [UsersService]
})
export class UsersModule {}

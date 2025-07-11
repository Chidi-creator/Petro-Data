import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Ferdinand', description: 'User’s first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Okoro', description: 'User’s last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'ferdy@example.com',
    description: 'User’s email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User’s account password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '08012345678',
    description: 'User’s Nigerian phone number',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class AllUsersQueryDto {
   @ApiProperty({ example: 1, description: 'Page number for paginated users' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}

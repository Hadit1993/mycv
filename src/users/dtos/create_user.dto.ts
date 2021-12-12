import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export default class CreateUserDto {
  @IsEmail({}, { message: 'email is invalid' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsString({ message: 'password must be string' })
  @IsDefined({ message: 'password is required' })
  password: string;
}

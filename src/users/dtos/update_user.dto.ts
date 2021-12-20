import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export default class UpdateUserDto {
  @IsEmail({}, { message: 'email is invalid' })
  @IsOptional()
  email: string;

  @MinLength(8, { message: 'password must be at least 8 characters' })
  @IsString()
  @IsOptional()
  password: string;
}

import { HttpStatus, Injectable } from '@nestjs/common';

import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import CustomHttpException from 'src/exceptions/custom_http.exception';

const scrypt = promisify(_scrypt);

@Injectable()
export default class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length > 0)
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, {
        email: 'email already in use',
      });
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    const user = await this.userService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user)
      throw new CustomHttpException(HttpStatus.NOT_FOUND, {
        email: 'user with this email not found',
      });

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, {
        password: 'password is incorrect',
      });

    return user;
  }
}

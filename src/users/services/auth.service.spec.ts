import { Test } from '@nestjs/testing';

import User from '../user.entity';
import AuthService from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('abcde@abc.com', '12345');
    expect(user.password).not.toEqual('12345');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use ', (done) => {
    service.signup('asd@dfgdfg', '15215156').then(() => {
      service.signup('asd@dfgdfg', '15215156').catch(() => done());
    });
  });

  it('throws if signin is called with an unused email', (done) => {
    service.signin('abcdefgh@1455959.com', 'ijuijuihjuih').catch(() => done());
  });

  it('throws an error if an invalid password is provided', (done) => {
    service.signup('abcdefgh@1455959.com', 'ijuijuihjuih').then(() => {
      service.signin('abcdefgh@1455959.com', 'ijuijuihjui').catch(() => done());
    });
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('uhujiu@jiojij.com', 'ujhuhiuh');
    const user = await service.signin('uhujiu@jiojij.com', 'ujhuhiuh');
    expect(user).toBeDefined();
  });
});

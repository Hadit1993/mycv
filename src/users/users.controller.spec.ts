import { Test, TestingModule } from '@nestjs/testing';
import AuthService from './services/auth.service';
import { UsersService } from './services/users.service';
import User from './user.entity';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id) =>
        Promise.resolve({
          id,
          email: 'uhun@uhuhu.com',
          password: 'ijsijisr',
        } as User),
      find: (email) =>
        Promise.resolve([{ id: 1, email, password: '12154854' } as User]),
      // remove: () => {},
      // update: () => {}
    };

    fakeAuthService = {
      // signup: () => {},
      signin: (email, password) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('ujhuhu@uhuhu.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('ujhuhu@uhuhu.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('5');
    expect(user).toBeDefined();
    expect(user.id).toEqual(5);
  });

  it('signin updates session and returns user', async () => {
    const session = { userId: 0 };
    const user = await controller.signin(
      { email: 'ihuihuh@jbhyuhd.com', password: 'junjnbusujwe' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { User } from "./entities/user";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import {v4 as uuidv4} from 'uuid'

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users = []

    mockUsersService = {
      findOne(email: string) {
        const user = users.find(user => user.email === email)
        return Promise.resolve(user || null)
      },
      async createUser(email: string, password: string) {
        const user = await this.findOne(email)

        if (user) {
          throw new BadRequestException()
        }

        users.push({
          email,
          password,
          id: uuidv4()
        } as User)

        return Promise.resolve(users[users.length - 1])
      },
      async signIn(email: string, password: string) {
        const user = await this.findOne(email)

        if (!user) {
          throw new UnauthorizedException()
        }

        user['access_token'] = 'mocked_access_token'

        return Promise.resolve(user as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signup user', async () => {
    const body = {
      email: 'any@email.com',
      password: 'any-password'
    }

    await controller.signUpUser(body)

    const user = await mockUsersService.findOne(body.email)

    expect(user).toBeDefined()
    expect(user.email).toEqual(body.email)
  })

  it('should throw BadRequestException when signup used email', async () => {
    const body = {
      email: 'any@email.com',
      password: 'any-password'
    }

    await controller.signUpUser(body)

    await expect(
      controller.signUpUser(body)
    ).rejects.toThrow(BadRequestException)
  })

  it('should signin user', async () => {
    const body = {
      email: 'any@email.com',
      password: 'any-password'
    }

    await controller.signUpUser(body)

    const user = await controller.signInUser(body)

    expect(user).toBeDefined()
    expect(user['access_token']).toBeDefined()
  })

  it('should throw UnauthorizedException when user is invalid', async () => {
    const body = {
      email: 'any@email.com',
      password: 'any-password'
    }

    await expect(
      controller.signInUser(body)
    ).rejects.toThrow(UnauthorizedException)
  })
});

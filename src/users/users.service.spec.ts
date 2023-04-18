import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user";
import mock = jest.mock;
import * as mongoose from "mongoose";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository
  let mockJwtService
  let mockConfigService

  beforeEach(async () => {
    const users = []

    mockJwtService = {
      signAsync: () => {
        return 'mocked_access_token'
      }
    }

    mockUsersRepository = {
      findOneBy: (query: any) => {
        const queryKeys = Object.keys(query)

        const foundUser = users.find(user => {
          const matchedKeys = queryKeys.filter(key => {
            return user[key] === query[key]
          })

          return matchedKeys.length === queryKeys.length
        })

        return foundUser || null
      },
      create: (data: any) => {
        return {
          id: new mongoose.Types.ObjectId(),
          ...data
        }
      },
      save: (data: any) => {
        const index = users.findIndex(movie => movie.id === data.id)

        if (index === -1) {
          users.push(data)
          return users[users.length - 1]
        } else {
          users.splice(index, 1, data)
          return users[index]
        }
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup user', async () => {
    const userData = {
      email: 'any-email@email.com',
      password: 'any-password'
    }

    const user = await service.createUser(userData.email, userData.password)

    expect(user).toBeDefined()
    expect(user.email).toEqual(userData.email)
  })

  it('should throw BadRequestError when signup with used e-mail', async () => {
    const userData = {
      email: 'any-email@email.com',
      password: 'any-password'
    }

    await service.createUser(userData.email, userData.password)

    await expect(
      service.createUser(userData.email, userData.password)
    ).rejects.toThrow(BadRequestException)
  })

  it('should sign in user', async () => {
    const userData = {
      email: 'any-email@email.com',
      password: 'any-password'
    }

    await service.createUser(userData.email, userData.password)

    const user = await service.signIn(userData.email, userData.password)

    expect(user).toBeDefined()
    expect(user['access_token']).toBeDefined()
  })

  it('should throw UnauthorizedException when sign with invalid user', async () => {
    await expect(
      service.signIn('any@email.com', 'any-password')
    ).rejects.toThrow(UnauthorizedException)
  })
});

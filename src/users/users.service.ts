import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user";
import { Repository } from "typeorm";
import {randomBytes, scryptSync} from 'crypto'

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repository: Repository<User>) {
  }

  async createUser(email: string, password: string) {
    const foundUser = await this.repository.findOneBy({ email })

    if (foundUser) {
      throw new BadRequestException('E-mail already used')
    }

    const salt = randomBytes(8).toString('hex')
    const hash = (await scryptSync(password, salt, 32)) as Buffer
    const result = salt + '.' + hash.toString('hex')

    const user = this.repository.create({
      email,
      password: result
    })

    return this.repository.save(user)
  }

  async signIn(email: string, password: string) {
    const user = await this.repository.findOneBy({ email })

    if (!user) {
      throw new UnauthorizedException()
    }

    const [salt, storedHash] = user.password.split('.')
    const hash = (await scryptSync(password, salt, 32)) as Buffer

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException()
    }

    return user
  }
}

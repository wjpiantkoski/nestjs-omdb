import { Body, Controller, Post } from "@nestjs/common";
import { UserSignDto } from "./dtos/user-sign.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {
  }

  @Post('/signup')
  async signUpUser(@Body() body: UserSignDto) {
    return this.usersService.createUser(body.email, body.password)
  }

  @Post('/signin')
  async signInUser(@Body() body: UserSignDto) {
    return this.usersService.signIn(body.email, body.password)
  }

}

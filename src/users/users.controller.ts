import { Body, Controller, Post } from "@nestjs/common";
import { UserSignupDto } from "./dtos/user-signup.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {
  }

  @Post('/signup')
  async signUpUser(@Body() body: UserSignupDto) {
    await this.usersService.createUser(body.email, body.password)
  }

}

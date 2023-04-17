import { IsEmail, IsString } from "class-validator";

export class UserSignupDto {

  @IsEmail()
  email: string

  @IsString()
  password: string

}
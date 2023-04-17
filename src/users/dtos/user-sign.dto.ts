import { IsEmail, IsString } from "class-validator";

export class UserSignDto {

  @IsEmail()
  email: string

  @IsString()
  password: string

}
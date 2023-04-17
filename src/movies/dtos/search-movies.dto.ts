import {IsString} from 'class-validator'

export class SearchMoviesDto {

  @IsString()
  title: string

}
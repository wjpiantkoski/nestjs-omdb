import {IsString, IsUrl} from 'class-validator'

export class OmdbMovieDto {

  @IsString()
  Title: string

  @IsString()
  Actors: string

  @IsString()
  Plot: string

  @IsUrl()
  Poster: string

}
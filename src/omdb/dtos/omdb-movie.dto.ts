import {IsString, IsUrl} from 'class-validator'

export class OmdbMovieDto {

  @IsString()
  imdbID: string

  @IsString()
  Title: string

  @IsString()
  Actors: string

  @IsString()
  Plot: string

  @IsUrl()
  Poster: string

}
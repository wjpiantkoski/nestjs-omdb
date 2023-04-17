import {IsString} from 'class-validator'

export class ListFavoritesDto {

  @IsString()
  page: string

  @IsString()
  limit: string

}
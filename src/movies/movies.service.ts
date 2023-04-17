import { Injectable } from "@nestjs/common";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { Repository } from "typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class MoviesService {

  constructor(@InjectRepository(FavoriteMovie) private repository: Repository<FavoriteMovie>) {
  }

  findOneByImdbId(imdbID: string) {
    return this.repository.findOneBy({ imdbID })
  }

  async createFavoriteMovie(data: CreateFavoriteDto) {
    const foundFavoriteMovie = await this.findOneByImdbId(data.imdbID)

    if (foundFavoriteMovie) {
      return foundFavoriteMovie
    }

    const favoriteMovie = this.repository.create(data)

    return this.repository.save(favoriteMovie)
  }

}

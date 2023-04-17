import { Injectable } from "@nestjs/common";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { Repository } from "typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user";

@Injectable()
export class MoviesService {

  constructor(@InjectRepository(FavoriteMovie) private repository: Repository<FavoriteMovie>) {
  }

  findOne(imdbID: string, userId: string) {
    return this.repository
      .createQueryBuilder()
      .innerJoin('user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('imdbID = :imdbID', { imdbID })
      .getRawOne()
  }

  async createFavoriteMovie(data: CreateFavoriteDto, user: User) {
    const foundFavoriteMovie = await this.findOne(data.imdbID, user.id)

    if (foundFavoriteMovie) {
      return foundFavoriteMovie
    }

    const favoriteMovie = this.repository.create(data)

    favoriteMovie.user = user

    return this.repository.save(favoriteMovie)
  }

  async findAll(userId: string, skip: number, limit: number) {
    const [totalItems, items] = await Promise.all([
      this.repository
        .createQueryBuilder()
        .innerJoin('user', 'user')
        .where('user.id = :userId', { userId })
        .getCount(),

      this.repository
        .createQueryBuilder()
        .select(
          [
            'Title',
            'Actors',
            'Plot',
            'Poster',
            'imdbID',
            'user.id as userId'
          ]
        )
        .innerJoin('user', 'user')
        .where('user.id = :userId', { userId })
        .getRawMany()
    ])

    return { totalItems, items }
  }

  async removeFavoriteMovie(imdbID: string, userId: string) {
    await this.repository.query(
      'DELETE FROM favorite_movie as movie WHERE movie.userId = ? AND movie.imdbID = ?',
      [userId, imdbID]
    )
  }
}

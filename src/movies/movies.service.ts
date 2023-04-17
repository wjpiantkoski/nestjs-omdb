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

  findOneByImdbId(imdbID: string) {
    return this.repository.findOneBy({ imdbID })
  }

  async createFavoriteMovie(data: CreateFavoriteDto, user: User) {
    const foundFavoriteMovie = await this.findOneByImdbId(data.imdbID)

    if (foundFavoriteMovie) {
      return foundFavoriteMovie
    }

    const favoriteMovie = this.repository.create(data)

    favoriteMovie.user = user

    return this.repository.save(favoriteMovie)
  }

  async findAll(userId: string, skip: number, limit: number) {
    // const [totalItems, items] = await Promise.all([
    //   this.repository.count({
    //     where: {
    //       user: userId
    //     }
    //   }),
    //   this.repository.find({
    //     skip,
    //     take: limit,
    //     order: { Title: 1 }
    //   })
    // ])

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

  async removeFavoriteMovie(imdbID: string) {
    await this.repository.delete({ imdbID })
  }
}

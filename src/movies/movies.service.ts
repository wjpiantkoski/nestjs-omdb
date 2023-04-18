import { Injectable } from "@nestjs/common";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { Repository } from "typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(FavoriteMovie) private repository: Repository<FavoriteMovie>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async getMovieFromOmdb(title: string) {
    if (!title) {
      return null
    }

    const url = `${this.configService.get<string>('OMDB_API_BASE')}?apikey=${this.configService.get<string>('OMDB_API_KEY')}&t=${title}`;
    const { data } = await this.httpService.axiosRef.get(url);

    return {
      imdbID: data.imdbID,
      Title: data.Title,
      Actors: data.Actors,
      Plot: data.Plot,
      Poster: data.Poster
    };
  }

  findOne(imdbID: string, userId: string) {
    return this.repository.findOneBy({
      imdbID,
      user: { id: userId }
    });
  }

  async createFavoriteMovie(data: CreateFavoriteDto, user: User) {
    const foundFavoriteMovie = await this.findOne(data.imdbID, user.id);

    if (foundFavoriteMovie) {
      return foundFavoriteMovie;
    }

    const favoriteMovie = this.repository.create(data);

    favoriteMovie.user = user;
    await this.repository.save(favoriteMovie);

    return this.findOne(favoriteMovie.imdbID, user.id);
  }

  async findAll(userId: string, skip: number, limit: number) {
    const [totalItems, items] = await Promise.all([
      this.repository.countBy({ user: { id: userId } }),
      this.repository.find({
        skip,
        take: limit,
        where: { user: { id: userId } },
      })
    ]);

    return { totalItems, items };
  }

  async removeFavoriteMovie(imdbID: string, userId: string) {
    await this.repository.delete({
      imdbID,
      user: { id: userId }
    })
  }
}

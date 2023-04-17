import { Injectable } from "@nestjs/common";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { InjectModel } from "@nestjs/mongoose";
import { FavoriteMovie } from "./schemas/favorite-movie.schema";
import { Model } from "mongoose";

@Injectable()
export class MoviesService {

  constructor(@InjectModel(FavoriteMovie.name) private favoriteMovieModel: Model<FavoriteMovie>) {
  }

  async createFavoriteMovie(data: CreateFavoriteDto) {
    const foundFavoriteMovie = await this.favoriteMovieModel.findOne({ imdbID: data.imdbID })

    if (foundFavoriteMovie) {
      return foundFavoriteMovie
    }

    const favoriteMovie = new this.favoriteMovieModel(data)
    return favoriteMovie.save()
  }

}

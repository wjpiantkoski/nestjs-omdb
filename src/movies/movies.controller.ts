import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SearchMoviesDto } from "./dtos/search-movies.dto";
import { OmdbService } from "../omdb/omdb.service";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { MoviesService } from "./movies.service";

@Controller('movies')
export class MoviesController {

  constructor(
    private omdbService: OmdbService,
    private moviesService: MoviesService
  ) {
  }

  @Get()
  async getMovies(@Query() query: SearchMoviesDto) {
    if (!query.title) {
      return []
    }

    return this.omdbService.getMovie(query.title)
  }

  @Post('/favorites')
  async addFavoriteMovie(@Body() body: CreateFavoriteDto) {
    return this.moviesService.createFavoriteMovie(body)
  }
}

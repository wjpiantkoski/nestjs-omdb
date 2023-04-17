import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { SearchMoviesDto } from "./dtos/search-movies.dto";
import { OmdbService } from "../omdb/omdb.service";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { MoviesService } from "./movies.service";
import { ListFavoritesDto } from "./dtos/list-favorites.dto";

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

  @Get('/favorites')
  getFavoritesMovies(@Query() query: ListFavoritesDto) {
    let {page, limit} = query

    const pageNumber = page ? parseInt(page) : 1
    const limitNumber = limit ? parseInt(limit) : 10
    const skip = (pageNumber - 1) * limitNumber

    return this.moviesService.findAll(skip, limitNumber)
  }

  @Post('/favorites')
  async addFavoriteMovie(@Body() body: CreateFavoriteDto) {
    return this.moviesService.createFavoriteMovie(body)
  }
}

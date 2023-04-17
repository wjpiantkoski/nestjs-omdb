import { Controller, Get, Query } from "@nestjs/common";
import { SearchMoviesDto } from "./dtos/search-movies.dto";
import { OmdbService } from "../omdb/omdb.service";

@Controller('movies')
export class MoviesController {

  constructor(private omdbService: OmdbService) {
  }

  @Get()
  async getMovies(@Query() query: SearchMoviesDto) {
    if (!query.title) {
      return []
    }

    return this.omdbService.getMovie(query.title)
  }

}

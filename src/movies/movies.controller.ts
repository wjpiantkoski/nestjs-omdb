import { Controller, Get, Query } from "@nestjs/common";
import { SearchMoviesDto } from "./dtos/search-movies.dto";

@Controller('movies')
export class MoviesController {

  @Get()
  async getMovies(@Query() query: SearchMoviesDto) {
    return query
  }

}

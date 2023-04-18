import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { SearchMoviesDto } from "./dtos/search-movies.dto";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";
import { MoviesService } from "./movies.service";
import { ListFavoritesDto } from "./dtos/list-favorites.dto";
import { AuthGuard } from "../users/guards/auth.guard";
import {Request} from "express";

@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {

  constructor(
    private moviesService: MoviesService
  ) {}

  @Get()
  async getMovies(@Query() query: SearchMoviesDto) {
    if (!query.title) {
      return []
    }

    return this.moviesService.getMovieFromOmdb(query.title)
  }

  @Get('/favorites')
  getFavoritesMovies(@Req() request: Request, @Query() query: ListFavoritesDto) {
    let {page, limit} = query
    const user = request['user']

    const pageNumber = page ? parseInt(page) : 1
    const limitNumber = limit ? parseInt(limit) : 10
    const skip = (pageNumber - 1) * limitNumber

    return this.moviesService.findAll(user.id, skip, limitNumber)
  }

  @Post('/favorites')
  addFavoriteMovie(@Req() request: Request, @Body() body: CreateFavoriteDto) {
    return this.moviesService.createFavoriteMovie(body, request['user'])
  }

  @Get('/favorites/:imdbID')
  async checkFavoriteMovie(@Req() request: Request, @Param('imdbID') imdbID: string) {
    const user = request['user']
    const favoriteMovie = await this.moviesService.findOne(imdbID, user.id)

    return { isFavorite: !!favoriteMovie }
  }

  @Delete('/favorites/:imdbID')
  removeFavoriteMovie(@Req() request: Request, @Param('imdbID') imdbID: string) {
    const user = request['user']
    return this.moviesService.removeFavoriteMovie(imdbID, user.id)
  }
}

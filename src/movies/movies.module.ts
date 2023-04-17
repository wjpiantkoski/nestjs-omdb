import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { OmdbModule } from "../omdb/omdb.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FavoriteMovie, FavoriteMovieSchema } from "./schemas/favorite-movie.schema";

@Module({
  imports: [
    OmdbModule,
    MongooseModule.forFeature([
      {
        name: FavoriteMovie.name,
        schema: FavoriteMovieSchema
      }
    ])
  ],
  controllers: [
    MoviesController
  ],
  providers: [
    MoviesService
  ]
})
export class MoviesModule {}

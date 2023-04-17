import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { OmdbModule } from "../omdb/omdb.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";

@Module({
  imports: [
    OmdbModule,
    TypeOrmModule.forFeature([FavoriteMovie])
  ],
  controllers: [
    MoviesController
  ],
  providers: [
    MoviesService
  ]
})
export class MoviesModule {}

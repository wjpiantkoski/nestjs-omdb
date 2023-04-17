import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { OmdbModule } from "../omdb/omdb.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    OmdbModule,
    TypeOrmModule.forFeature([FavoriteMovie])
  ],
  controllers: [
    MoviesController
  ],
  providers: [
    MoviesService,
    JwtService
  ]
})
export class MoviesModule {}

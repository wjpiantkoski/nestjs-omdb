import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import { JwtService } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
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

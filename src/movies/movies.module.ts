import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { OmdbModule } from "../omdb/omdb.module";

@Module({
  imports: [
    OmdbModule
  ],
  controllers: [
    MoviesController
  ],
  providers: [
    MoviesService
  ]
})
export class MoviesModule {}

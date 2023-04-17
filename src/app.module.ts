import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OmdbModule } from './omdb/omdb.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "omdb.sqlite",
      entities: [],
      synchronize: true
    }),
    OmdbModule,
    MoviesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

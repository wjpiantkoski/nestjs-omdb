import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OmdbModule } from './omdb/omdb.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: `mongodb://${config.get<string>('DB_HOST')}/${config.get<string>('DB_NAME')}`
        }
      }
    }),
    OmdbModule,
    MoviesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}

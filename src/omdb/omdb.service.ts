import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { OmdbMovieDto } from "./dtos/omdb-movie.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OmdbService {

  private apiBase: string
  private apiKey: string

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiBase = configService.get<string>('OMDB_API_BASE')
    this.apiKey = configService.get<string>('OMDB_API_KEY')
  }

  async getMovies(title: string) {
    const url = `${this.apiBase}?apikey=${this.apiKey}&t=${title}`;
    const { data } = await this.httpService.axiosRef.get(url);

    return {
      imdbID: data.imdbID,
      Title: data.Title,
      Actors: data.Actors,
      Plot: data.Plot,
      Poster: data.Poster
    };
  }
}

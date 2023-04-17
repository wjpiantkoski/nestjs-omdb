import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
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

  async getMovie(title: string) {
    if (!title) {
      return null
    }

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

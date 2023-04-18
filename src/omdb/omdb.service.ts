import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OmdbService {

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async getMovie(title: string) {
    if (!title) {
      return null
    }

    const url = `${this.configService.get<string>('OMDB_API_BASE')}?apikey=${this.configService.get<string>('OMDB_API_KEY')}&t=${title}`;
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

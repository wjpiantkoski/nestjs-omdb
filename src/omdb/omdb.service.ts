import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { OmdbMovieDto } from "./dtos/omdb-movie.dto";

@Injectable()
export class OmdbService {

  private apiBase: string = process.env.OMDB_API_BASE;
  private apiKey: string = process.env.OMDB_API_KEY;

  constructor(private readonly httpService: HttpService) {
  }

  async getMovies(title: string): Promise<OmdbMovieDto> {
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

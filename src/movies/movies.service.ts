import { Injectable } from "@nestjs/common";
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";

@Injectable()
export class MoviesService {

  constructor() {
  }

  async createFavoriteMovie(data: CreateFavoriteDto) {

  }

}

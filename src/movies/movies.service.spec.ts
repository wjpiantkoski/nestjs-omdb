import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import * as mongoose from 'mongoose'
import { User } from "../users/entities/user";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import axios, { AxiosStatic } from "axios";
import * as process from "process";

import { config as dotenvConfig } from 'dotenv'

describe('MoviesService', () => {
  dotenvConfig()

  let user = {
    id: '01bff1d7-9072-4e69-949b-9724c84cd380'
  }

  let movie = {
    "imdbID": "tt2407380",
    "Title": "Test",
    "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
    "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
  }

  let service: MoviesService
  let mockFavoriteMovieRepository

  let mockConfigService: {}

  let mockHttpService: {
    readonly axiosRef:  | AxiosStatic;
    readonly instance: AxiosStatic | AxiosStatic
  }

  beforeEach(async () => {
    const favoriteMovies = []

    mockConfigService = {
      get(key) {
        return process.env[key]
      }
    }

    mockHttpService = {
      get axiosRef() {
        return axios
      },
      get instance() {
        return axios
      },
    }

    mockFavoriteMovieRepository = {
      findOneBy: (query: any) => {
        const foundMovie = favoriteMovies.find(movie => {
          return movie.imdbID === query.imdbID && movie.userId === query.userId
        })

        return foundMovie || null
      },
      save: (data: any) => {
        const index = favoriteMovies.findIndex(movie => movie.id === data.id)

        if (index === -1) {
          favoriteMovies.push(data)
          return favoriteMovies[favoriteMovies.length - 1]
        } else {
          favoriteMovies.splice(index, 1, data)
          return favoriteMovies[index]
        }
      },
      create: (data: any) => {
        return {
          id: new mongoose.Types.ObjectId(),
          ...data
        }
      },
      countBy: () => favoriteMovies.length,
      find: (options: any) => {
        const {skip, take} = options
        return favoriteMovies.slice(skip, (skip + take))
      },
      delete: (query: any) => {
        const movieIndex = favoriteMovies.findIndex(movie => {
          return movie.imdbID === query.imdbID && movie.userId === query.userId
        })

        if (movieIndex > -1) {
          favoriteMovies.splice(movieIndex, 1)
        }
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: getRepositoryToken(FavoriteMovie),
          useValue: mockFavoriteMovieRepository
        },
        {
          provide: HttpService,
          useValue: mockHttpService
        }
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    await service.createFavoriteMovie(movie, user as User)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a movie from omdb', async () => {
    const movie = await service.getMovieFromOmdb('test')
    expect(movie).toBeDefined()
  })

  it("should create a favorite movie", async () => {
    const movie = {
      "imdbID": "tt2407381",
      "Title": "Test",
      "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
      "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
    }

    const favoriteMovie = await service.createFavoriteMovie(movie, user as User)

    expect(favoriteMovie).toBeDefined()
    expect(favoriteMovie.imdbID).toEqual(movie.imdbID)
  });

  it("should not create a repeated favorite movie", async () => {
    const movie = {
      "imdbID": "tt2407381",
      "Title": "Test",
      "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
      "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
    }

    const favoriteMovie = await service.createFavoriteMovie(movie, user as User)
    expect(favoriteMovie).toBeDefined()

    const anotherFavoriteMovie = await service.createFavoriteMovie(movie, user as User)
    expect(anotherFavoriteMovie.id).toEqual(favoriteMovie.id)
  });

  it('should find a movie by imdbID', async () => {
    const foundMovie = await service.findOne(movie.imdbID, user.id)

    expect(foundMovie).toBeDefined()
    expect(foundMovie.imdbID).toEqual(movie.imdbID)
  })

  it('should return null when not found a movie by imdbID', async () => {
    const foundMovie = await service.findOne('tt2407381', user.id)
    expect(foundMovie).toEqual(null)
  })

  it('should list favorite movies', async () => {
    const {totalItems, items} = await service.findAll(user.id,0, 10)

    expect(totalItems).toEqual(1)
    expect(items.length).toEqual(1)
    expect(items[0].imdbID).toEqual(movie.imdbID)
  })

  it('should remove a movie from favorites', async () => {
    await service.removeFavoriteMovie(movie.imdbID, user.id)

    const {totalItems, items} = await service.findAll(user.id, 0, 10)

    expect(totalItems).toEqual(0)
    expect(items.length).toEqual(0)
  })
});

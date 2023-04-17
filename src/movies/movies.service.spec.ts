import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import { FavoriteMovie } from "./entities/favorite-movie";
import * as mongoose from 'mongoose'
import { CreateFavoriteDto } from "./dtos/create-favorite.dto";

describe('MoviesService', () => {
  let movie = {
    "imdbID": "tt2407380",
    "Title": "Test",
    "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
    "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
  }

  let service: MoviesService
  let mockFavoriteMovieRepository

  beforeEach(async () => {
    const favoriteMovies = []

    mockFavoriteMovieRepository = {
      findOneBy: (query: any) => {
        const queryKeys = Object.keys(query)

        const foundMovie = favoriteMovies.find(movie => {
          const matchedKeys = queryKeys.filter(key => {
            return movie[key] === query[key]
          })

          return matchedKeys.length === queryKeys.length
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
      count: () => favoriteMovies.length,
      find: (options: any) => {
        const {skip, take} = options
        return favoriteMovies.slice(skip, (skip + take))
      },
      delete: (query: any) => {
        const queryKeys = Object.keys(query)

        const movieIndex = favoriteMovies.findIndex(movie => {
          const matchedKeys = queryKeys.filter(key => {
            return movie[key] === query[key]
          })

          return matchedKeys.length === queryKeys.length
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
          provide: getRepositoryToken(FavoriteMovie),
          useValue: mockFavoriteMovieRepository
        }
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    await service.createFavoriteMovie(movie)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create a favorite movie", async () => {
    const movie = {
      "imdbID": "tt2407381",
      "Title": "Test",
      "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
      "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
    }

    const favoriteMovie = await service.createFavoriteMovie(movie)

    expect(favoriteMovie).toBeDefined()
    expect(mongoose.isValidObjectId(favoriteMovie.id)).toBeTruthy()
  });

  it("should not create a repeated favorite movie", async () => {
    const movie = {
      "imdbID": "tt2407381",
      "Title": "Test",
      "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
      "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
    }

    const favoriteMovie = await service.createFavoriteMovie(movie)
    expect(favoriteMovie).toBeDefined()

    const anotherFavoriteMovie = await service.createFavoriteMovie(movie)
    expect(anotherFavoriteMovie.id).toEqual(favoriteMovie.id)
  });

  it('should find a movie by imdbID', async () => {
    const foundMovie = await service.findOneByImdbId(movie.imdbID)

    expect(foundMovie).toBeDefined()
    expect(foundMovie.imdbID).toEqual(movie.imdbID)
  })

  it('should return null when not found a movie by imdbID', async () => {
    const foundMovie = await service.findOneByImdbId('tt2407381')
    expect(foundMovie).toEqual(null)
  })

  it('should list favorite movies', async () => {
    const {totalItems, items} = await service.findAll(0, 10)

    expect(totalItems).toEqual(1)
    expect(items.length).toEqual(1)
    expect(items[0].imdbID).toEqual(movie.imdbID)
  })

  it('should remove a movie from favorites', async () => {
    await service.removeFavoriteMovie(movie.imdbID)

    const {totalItems, items} = await service.findAll(0, 10)

    expect(totalItems).toEqual(0)
    expect(items.length).toEqual(0)
  })
});

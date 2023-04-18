import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { JwtService } from "@nestjs/jwt";
import { config as dotenvConfig } from "dotenv";
import process from "process";
import { ConfigService } from "@nestjs/config";
import { MoviesService } from "./movies.service";
import { Request } from "express";
import {v4 as uuidv4} from 'uuid'

describe("MoviesController", () => {
  dotenvConfig();

  let user = {
    id: "01bff1d7-9072-4e69-949b-9724c84cd380"
  };

  let controller: MoviesController;
  let mockJwtService;
  let mockConfigService;
  let mockMoviesService;

  beforeEach(async () => {
    mockConfigService = {
      get(key) {
        return process.env[key];
      }
    };

    mockJwtService = {
      signAsync: () => {
        return "mocked_access_token";
      }
    };

    const favorites = []

    mockMoviesService = {
      getMovieFromOmdb(title: string) {
        const movies = [
          {
            "imdbID": "tt2407380",
            "Title": "Test",
            "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
            "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
            "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
          }
        ];

        const movie = movies.find(movie => {
          return movie.Title.trim().toLowerCase() === title.trim().toLowerCase();
        });

        return movie || null;
      },
      createFavoriteMovie(body: any, user: any) {
        const foundMovie = favorites.find(movie => {
          return movie.imdbID === body.imdbID && movie.user.id === user.id
        })

        if (foundMovie) {
          return foundMovie
        }

        const movie = {
          user,
          ...body,
          id: uuidv4(),
        }

        favorites.push(movie)

        return favorites[favorites.length - 1]
      },
      getFavoriteMovies(userId: string) {
        return favorites.filter(movie => movie.user.id === userId)
      },
      findOne(imdbID: string, userId: string) {
        return favorites.find(movie => {
          return movie.imdbID === imdbID && movie.user.id === userId
        })
      },
      removeFavoriteMovie(imdbID: string, userId: string) {
        const index = favorites.findIndex(movie => {
          return movie.imdbID === imdbID && movie.user.id === userId
        })

        if (index > -1) {
          favorites.splice(index, 1)
        }
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService
        }
      ]
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should get a movie from omdb", async () => {
    const movie = await controller.getMovie({ title: "test" });
    expect(movie).toBeDefined();
  });

  it("should return an empty object when title is empty", async () => {
    const movie = await controller.getMovie({ title: "" });
    expect(Object.keys(movie).length).toBe(0);
  });

  it("should add a favorite movie", async () => {
    const mockRequest = {
      body: {
        "imdbID": "tt2407380",
        "Title": "Test",
        "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
        "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
      }
    } as Request

    mockRequest['user'] = user

    const movie = await controller.addFavoriteMovie(mockRequest, mockRequest.body);

    expect(movie).toBeDefined()
    expect(movie.id).toBeDefined()
  });

  it('should not duplicate favorite movie', async () => {
    const mockRequest = {
      body: {
        "imdbID": "tt2407380",
        "Title": "Test",
        "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
        "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
      }
    } as Request

    mockRequest['user'] = user

    await controller.addFavoriteMovie(mockRequest, mockRequest.body);

    await controller.addFavoriteMovie(mockRequest, mockRequest.body);

    const movies = await mockMoviesService.getFavoriteMovies(user.id)

    expect(movies.length).toBe(1)
  })

  it('should return true if a movie is favorite', async () => {
    const mockRequest = {
      body: {
        "imdbID": "tt2407380",
        "Title": "Test",
        "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
        "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
      }
    } as Request

    mockRequest['user'] = user

    const movie = await controller.addFavoriteMovie(mockRequest, mockRequest.body);
    const result = await controller.checkFavoriteMovie(mockRequest, movie.imdbID)

    expect(result.isFavorite).toBeTruthy()
  })

  it('should return false if a movie is not a favorite', async () => {
    const mockRequest = {} as Request

    mockRequest['user'] = user

    const result = await controller.checkFavoriteMovie(mockRequest, '123')

    expect(result.isFavorite).toBeFalsy()
  })

  it('should remove a movie from favorites', async () => {
    const mockRequest = {
      body: {
        "imdbID": "tt2407380",
        "Title": "Test",
        "Plot": "In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
        "Actors": "Scott Marlowe, Matthew Risch, Evan Boomer"
      }
    } as Request

    mockRequest['user'] = user

    const movie = await controller.addFavoriteMovie(mockRequest, mockRequest.body);

    await controller.removeFavoriteMovie(mockRequest, movie.imdbID)

    const result = await controller.checkFavoriteMovie(mockRequest, 'tt2407380')
    expect(result.isFavorite).toBeFalsy()
  })
});

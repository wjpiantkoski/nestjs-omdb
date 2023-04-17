import { Test, TestingModule } from '@nestjs/testing';
import { OmdbService } from './omdb.service';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

describe('OmdbService', () => {
  let service: OmdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env', `.env.${process.env.NODE_ENV}`]
        }),
      ],
      providers: [OmdbService],
    }).compile();

    service = module.get<OmdbService>(OmdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a movie', async () => {
    const movie = await service.getMovies('test')
    // expect(movie).toBeDefined()
  })
});

import { Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  providers: [OmdbService],
  exports: [OmdbService]
})
export class OmdbModule {}

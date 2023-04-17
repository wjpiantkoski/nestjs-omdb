import { Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [OmdbService],
  exports: [OmdbService]
})
export class OmdbModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FavoriteMovieDocument = HydratedDocument<FavoriteMovie>

@Schema()
export class FavoriteMovie {

  @Prop({
    required: true,
    unique: true
  })
  imdbID: string

  @Prop({ required: true })
  Title: string

  @Prop({ required: true })
  Plot: string

  @Prop({ required: true })
  Poster: string
}

export const FavoriteMovieSchema = SchemaFactory.createForClass(FavoriteMovie)
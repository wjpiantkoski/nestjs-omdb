import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class FavoriteMovie {

  @ObjectIdColumn()
  id: ObjectId

  @Column({ unique: true })
  imdbID: string

  @Column()
  Title: string

  @Column()
  Plot: string

  @Column()
  Poster: string

  @Column()
  Actors: string
}
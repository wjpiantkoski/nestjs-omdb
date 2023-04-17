import { Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FavoriteMovie {

  @PrimaryGeneratedColumn('uuid')
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
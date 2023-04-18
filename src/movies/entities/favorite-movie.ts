import { Column, Entity, JoinColumn, ManyToOne, ObjectId, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user";

@Entity()
export class FavoriteMovie {

  @PrimaryGeneratedColumn('uuid')
  id: string

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

  @ManyToOne(
    () => User,
    user => user.favoriteMovies
  )
  @JoinColumn()
  user: User
}
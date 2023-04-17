import { Column, Entity, ObjectId, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FavoriteMovie } from "../../movies/entities/favorite-movie";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @OneToMany(
    () => FavoriteMovie,
    report => report.user
  )
  favoriteMovies: FavoriteMovie[]
}
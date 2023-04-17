import { Column, Entity, ObjectId, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: ObjectId

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string
}
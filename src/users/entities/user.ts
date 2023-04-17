import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectId

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: false })
  password: string
}
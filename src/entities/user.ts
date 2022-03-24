import {Column, Entity} from "typeorm";
import {Base} from "@src/entities/BaseEntity";

@Entity()
export class User extends Base {
  @Column()
  username: string

  @Column()
  hash: string
}
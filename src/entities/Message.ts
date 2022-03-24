import {Column, Entity} from "typeorm";
import {Base} from "./BaseEntity";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity()

export class Message extends Base {
  @Column()
  @Field()
  name: string

  @Column()
  @Field()
  email: string

  @Column()
  @Field()
  phoneNumber: string

  @Column({type: "varchar", length: 2000})
  @Field()
  content: string
}
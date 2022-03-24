import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Column, Entity} from "typeorm";
import { Base } from "./BaseEntity";


@ObjectType()
@Entity()
export class Subscribe extends Base{
  @Field()
  @Column()
  name:string

  @Field()
  @Column()
  phoneNumber:string

  @Field()
  @Column()
  email:string
}


@InputType()
export class SubscribeInput{
  @Field()
  name:string

  @Field()
  phoneNumber:string

  @Field()
  email:string
}
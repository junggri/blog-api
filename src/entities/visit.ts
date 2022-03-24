import {Column, Entity} from "typeorm";
import {ObjectType, Field} from "@nestjs/graphql";
import {Base} from "@src/entities/BaseEntity";


@ObjectType()
@Entity()

export class Visit extends Base {
  @Column()
  identifier: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  regionName: string;

  @Field()
  @Column()
  regionAddress: string

  @Field()
  @Column({default: 1})
  count: number

}


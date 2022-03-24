import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class LikeInput {
  @Field()
  postHashId: string
}
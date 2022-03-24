import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class HashIdInput {
  @Field()
  hashId: string
}
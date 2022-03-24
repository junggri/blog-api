import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class VisitInput {
  @Field()
  lat: number

  @Field()
  lon: number
}
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class PaginationInput {
  @Field()
  first: number

  @Field({nullable: true})
  after?: number

  @Field({defaultValue:"open"})
  filter : string
}
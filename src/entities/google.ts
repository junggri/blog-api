import {Field, ObjectType} from "@nestjs/graphql";
import {Base} from "@src/entities/BaseEntity";

interface TotalsForAllResults {
  user: string,
  session: string
}

@ObjectType()
class Result {
  @Field()
  user: string

  @Field()
  session: string
}

@ObjectType()
export class Google extends Base {
  @Field(() => Result)
  totalsForAllResults: TotalsForAllResults

  @Field()
  rows: number
}
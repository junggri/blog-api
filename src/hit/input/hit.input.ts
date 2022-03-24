import {Field, InputType, registerEnumType} from "@nestjs/graphql";


export enum DashBoardFrequency {
  ONE_DAY = "one_day",
  SEVEN_DAY = "seven_day",
  FIFTEEN_DAY = "fifteen_day",
  ONE_MONTH = "one_month",
  THREE_MONTH = "three_month",
  SIX_MONTH = "six_month"
}

registerEnumType(DashBoardFrequency, {
  name: 'dashBoardFrequency'
});

@InputType()
export class HitInput {
  @Field()
  postHashId: string;
}

@InputType()
export class DashBoardInput {
  @Field(() => DashBoardFrequency)
  frequency: DashBoardFrequency;
}


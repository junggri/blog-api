import {Field, ObjectType} from "@nestjs/graphql";
import {Hit} from "@src/entities/Hit";

@ObjectType()
export class DashBoard {
    @Field(() => [Hit])
    hit: Hit[]
}
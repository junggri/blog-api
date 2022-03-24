import {Field, InputType, ObjectType} from "@nestjs/graphql";

@InputType()
export class YoutubeInput {
  @Field({nullable: true})
  nextPageToken?: string;
}

@ObjectType()
export class Youtube {
  @Field({nullable: true})
  nextPageToken?: string;

  @Field()
  data: string;
}
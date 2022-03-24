import {Field, InputType, Int} from "@nestjs/graphql";

@InputType()
export class ReplyInput {
  @Field()
  hashId: string;
  //
  // @Field()
  // depth: number;
}

@InputType()
export class ReplyCreateInput {
  @Field({description: "postHashId"})
  hashId: string;

  @Field()
  postTitle: string;

  @Field({nullable: true, description: "replyHashId"})
  replyHashId?: string;

  @Field()
  comment: string;

  @Field()
  writer: string;

  @Field({nullable: true})
  parentId?: number;
}

@InputType()
export class ReplyDeleteInput {
  @Field(() => [Int])
  replyIds: [number];

  @Field()
  hashId: string;
}
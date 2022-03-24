import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class TagInput {
  @Field()
  tagName: string;

  @Field({nullable: true})
  hashId?: string;
}

@InputType()
export class TagDeleteInput {
  @Field()
  hashId: string;
}
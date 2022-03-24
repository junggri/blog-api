import {Field, ObjectType} from "@nestjs/graphql";
import {Post} from "@src/entities/Post";


@ObjectType()
export class PageEdge {
  @Field()
  cursor: number;

  @Field()
  node: Post;
}


@ObjectType()
export class PageInfo {
  @Field({nullable: true})
  endCursor: number;

  @Field({nullable: true})
  hasNextPage: boolean;
}

@ObjectType()
export class PaginatedPost {
  @Field({nullable: true})
  leftCount: number;

  @Field(() => [PageEdge])
  edges: [PageEdge];

  @Field({nullable: true})
  pageInfo: PageInfo;
}
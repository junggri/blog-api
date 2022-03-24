import {Field, Int, ObjectType} from "@nestjs/graphql";
import {Column, Entity, JoinTable, ManyToMany, RelationId} from "typeorm";
import {Base} from "@src/entities/BaseEntity";
import {Post} from "@src/entities/Post";
import {TypeormLoaderExtension} from "@webundsoehne/nestjs-graphql-typeorm-dataloader";


@ObjectType()
@Entity()

export class Tag extends Base {
  @Field()
  @Column()
  tag: string;

  @RelationId((tag: Tag) => tag.post)
  postId: number;

  @Field(() => [Post])
  @ManyToMany(() => Post, post => post.tag)
  @JoinTable({name: "post_tag"})
  @TypeormLoaderExtension((tag: Tag) => tag.postId)
  post: Post[];
}
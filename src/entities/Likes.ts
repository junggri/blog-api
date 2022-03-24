import {ObjectType} from "@nestjs/graphql";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Base} from "@src/entities/BaseEntity";
import {Post} from "@src/entities/Post";

@ObjectType()
@Entity()

export class Likes extends Base {
  @Column()
  identifier: string

  @ManyToOne(() => Post, post => post.likes, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'post_id'})
  post: Post

  @Column()
  postId: number
}
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Post} from "@src/entities/Post";
import {ObjectType} from "@nestjs/graphql";
import {Base} from "@src/entities/BaseEntity";


@ObjectType()
@Entity()

export class Hit extends Base {
  @Column({type: 'uuid'})
  identifier: string;

  @ManyToOne(() => Post, post => post.hit, {onDelete: 'CASCADE'})
  @JoinColumn({name: "post_id"})
  post: Post;

  @Column({type: 'int', nullable: false})
  postId: number;
}
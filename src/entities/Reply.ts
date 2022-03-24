import {Field, ObjectType} from '@nestjs/graphql';
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {Base} from "@src/entities/BaseEntity";
import {Post} from "@src/entities/Post";

@ObjectType()
@Entity()

export class Reply extends Base {
  @Field()
  id: number

  @Field()
  @Column({type: "int"})
  bgroup: number;

  @Field()
  @Column({type: "int"})
  sorts: number;

  @Field()
  @Column({type: "int"})
  depth: number;

  @Field()
  @Column("varchar", {length: 500})
  comment: string;

  @Field()
  @Column("varchar", {length: 40})
  writer: string;

  @ManyToOne(() => Post, post => post.reply, {onDelete: 'CASCADE'})
  @JoinColumn({name: "post_id"})
  post: Post;

  @Column({type: 'int', nullable: false})
  @Field({nullable: true})
  postId: number;

  @Field({nullable: true})
  @Column({type: "int", nullable: true})
  parentId?: number;
  //
  // @Field(() => Reply, {nullable: true})
  // @ManyToOne(() => Reply, reply => reply.children, {onDelete: "CASCADE"})
  // @TypeormLoaderExtension((reply: Reply) => reply.parentId)
  // @JoinColumn({name: "parent_id"})
  // parent: Reply;
  //
  // @RelationId((reply: Reply) => reply.children)
  // childrenIds: number[];
  //
  // @OneToMany(() => Reply, reply => reply.parent, {cascade: true})
  // @Field(() => [Reply])
  // @TypeormLoaderExtension((reply: Reply) => reply.childrenIds)
  // children: Reply[];
}

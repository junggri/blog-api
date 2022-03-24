import {Field, ID, Int, ObjectType,} from "@nestjs/graphql";
import {BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Expose} from "class-transformer";
import {HashidsService} from "@src/hashids/hashids.service";


@ObjectType({isAbstract: true})
export abstract class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn({nullable: true})
  @Field({nullable: true})
  updatedAt?: Date;

  @DeleteDateColumn({nullable: true})
  deletedAt?: Date;

  @Field(() => ID)
  @Expose()
  get hashId() {
    return HashidsService.instance.encode(this.id);
  }
}

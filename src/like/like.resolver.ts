import {Args, Mutation, Query, Resolver} from '@nestjs/graphql'
import {LikeService} from "@src/like/like.service";
import {Likes} from "@src/entities";
import {LikeInput} from "@src/like/input/like.input";
import {ctx} from "@decorator/gqlContext.decorator";
import {Response} from "express";

@Resolver()
export class LikeResolver {
  constructor(
    private readonly likeService: LikeService
  ) {
  }

  @Mutation(() => [String], {nullable: true})
  async createLike(@ctx() res: Response, @Args('data') data: LikeInput) {
    return await this.likeService.createLike(res, data)
  }

  @Query(() => [String])
  async getLikeList(@ctx() res: Response) {
    return await this.likeService.getList(res)
  }

}
import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {HitService} from "@src/hit/hit.service";
import {Response} from "express";
import {DashBoardInput, HitInput} from "@src/hit/input/hit.input";
import {ctx} from "@decorator/gqlContext.decorator";
import {Hit} from "@src/entities";
import {HashIdInput} from "@src/entities/input/hashId.input";

@Resolver()
export class HitResolver {
  constructor(
    private readonly hitService: HitService
  ) {
  }

  @Mutation(() => String, {nullable: true})
  async createHit(@ctx() res: Response, @Args('data') data: HitInput) {
    return await this.hitService.createHit(res, data);
  }


  @Query(() => [Hit], {nullable: true})
  async getDashBoard(
    @Args("data") dataHashId: HashIdInput,
    @Args("data") data: DashBoardInput
  ) {
    return await this.hitService.getDashBoard(dataHashId.hashId, data);

  }
}


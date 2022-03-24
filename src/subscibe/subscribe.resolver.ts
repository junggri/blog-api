import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {Subscribe, SubscribeInput} from "@src/entities/Subscribe";
import {SubscribeService} from "@src/subscibe/subscribe.service";
import {ctx} from "@decorator/gqlContext.decorator";
import {Response} from "express";

@Resolver()
export class SubscribeResolver {
  constructor(
    private readonly subscribeService: SubscribeService
  ) {
  }

  @Query(() => Boolean)
  async isSubscribe(@ctx() res: Response) {
    return this.subscribeService.isSubscribe(res)
  }

  @Mutation(() => Subscribe)
  async subscribe(@ctx() res: Response, @Args('data') data: SubscribeInput) {
    return this.subscribeService.subscribe(res, data)
  }

  @Mutation(() => Boolean)
  async unsubscribe(@ctx() res: Response) {
    this.subscribeService.unsubscribe(res)
    return true
  }

}
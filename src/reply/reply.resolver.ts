import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ReplyService} from "@src/reply/reply.service";
import {Reply} from "@src/entities";
import {ReplyCreateInput, ReplyDeleteInput, ReplyInput} from "@src/reply/input/reply.input";

@Resolver()
export class ReplyResolver {
  constructor(
    private readonly replyService: ReplyService
  ) {
  }

  @Query(() => [Reply])
  async getReply(@Args('data') data: ReplyInput) {
    return await this.replyService.getReply(data);
  }

  @Mutation(() => Reply)
  async upsertReply(@Args('data') data: ReplyCreateInput) {
    return await this.replyService.upsertReply(data);
  }

  @Mutation(() => String)
  async deleteReply(@Args('data') data: ReplyDeleteInput) {
    await this.replyService.deleteReply(data);
  }

}
import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {TagService} from "@src/tag/tag.service";
import {TagDeleteInput, TagInput} from "@src/tag/input/tag.input";
import {Tag} from "@src/entities";

@Resolver()
export class TagResolver {
  constructor(
    private readonly tagService: TagService
  ) {
  }

  @Query(() => [Tag])
  async getTags() {
    return await this.tagService.getTags();
  }

  @Mutation(() => Tag)
  async upsertTag(@Args('data') data: TagInput) {
    return await this.tagService.upsertTag(data);
  }

  @Mutation(() => String)
  async deleteTag(@Args('data') data: TagDeleteInput) {
    return await this.tagService.deleteTag(data);
  }
}

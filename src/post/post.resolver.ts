import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {PostService} from '@src/post/post.service';
import {HashIds, Post} from "@src/entities/Post";
import {PostInput} from "@src/post/input/post.input";
import {FileUpload} from "@src/file/input/file.input";
import {HashIdInput} from "@src/entities/input/hashId.input";
import {PaginationInput} from "@src/pagination/input/pagination.input";
import {PaginatedPost} from "@src/entities/pagination";
import {GraphQLUpload} from 'graphql-upload';


@Resolver(of => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
  ) {
  }


  @Query(() => PaginatedPost, {name: "posts", nullable: true})
  async getAllPost(@Args('data') data: PaginationInput) {
    return await this.postService.findAllPost(data);
  }

  @Query(() => Post, {name: 'post'})
  async getPost(@Args("data") data: HashIdInput) {
    return await this.postService.findById(data.hashId);
  }


  @Query(() => HashIds)
  async getHashIdsToBuild() {
    const data = await this.postService.getHashIds()
    return {hashIds: data}
  }

  @Mutation(() => String)
  async deletePost(@Args("data") data: HashIdInput) {
    return await this.postService.deletePost(data.hashId);
  }

  @Mutation(() => String)
  async toPrivate(@Args("data") data: HashIdInput) {
    return this.postService.toPrivate(data.hashId);
  }

  @Mutation(() => Post)
  async upsertPost(
    @Args("data") data: PostInput,
    @Args("file", {type: () => GraphQLUpload, nullable: true}) file: FileUpload
  ) {
    return await this.postService.upsertPost(data, file);
  }
}

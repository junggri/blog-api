import {Query, Resolver} from "@nestjs/graphql";
import {UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "@src/auth/guard/auth.guard";


@Resolver()
export class UserResolver {
  constructor() {
  }

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async validate() {
    return "authorization success";
  }
}
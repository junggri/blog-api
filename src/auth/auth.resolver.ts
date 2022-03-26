import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {AuthService} from "@src/auth/auth.service";
import {UserInput} from "@src/user/input/user.input";
import {Auth} from "@src/entities/auth";
import {AuthenticationError} from "apollo-server-express";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @Mutation(() => Auth)
  async login(
    @Args("data") data: UserInput
  ) {
    const user = await this.authService.validationUser(data)

    if (!user) {
      throw new AuthenticationError("가입되지 않은 유저입니다.")
    }

    if (user) {
      const token = await this.authService.login(data)
      return token
    }

  }
}

import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {VisitService} from "@src/visit/visit.service";
import {Response} from "express";
import {ctx} from "@decorator/gqlContext.decorator";
import {Visit} from "@src/entities/visit";
import {DashBoardInput} from "@src/hit/input/hit.input";
import {VisitInput} from "@src/visit/input/visit.input";

@Resolver()
export class VisitResolver {
  constructor(
    private readonly visitService: VisitService
  ) {
  }

  @Query(() => [Visit], {nullable: true})
  async getVisitDashboard(@Args('data') data: DashBoardInput) {
    return this.visitService.getVisitDashboard(data);
  }

  @Mutation(() => Int)
  async createVisit(@ctx() response: Response, @Args('data') data: VisitInput) {
    return this.visitService.createVisit(response, data);
  }

}
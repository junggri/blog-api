import {Module} from "@nestjs/common";
import {LikeResolver} from "@src/like/like.resolver";
import {LikeService} from "@src/like/like.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Likes} from "@src/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Likes])],
  providers: [LikeResolver, LikeService],
  exports: []
})

export class LikeModule {
}
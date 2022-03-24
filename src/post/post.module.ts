import {Module} from '@nestjs/common';
import {PostService} from './post.service';
import {PostResolver} from './post.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "@src/entities";
import {FileModule} from "@src/file/file.module";
import {HashidsModule} from "@src/hashids/hashids.module";
import {PaginationModule} from "@src/pagination/pagination.module";
import {ReplyModule} from "@src/reply/reply.module";
import {VisitModule} from '@src/visit/visit.module';
import {MessageModule} from "@src/message/message.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    FileModule,
    HashidsModule,
    PaginationModule,
    ReplyModule,
  ],
  providers: [
    PostResolver,
    PostService,
  ],
  exports: [
    PostService
  ]
})
export class PostModule {
}

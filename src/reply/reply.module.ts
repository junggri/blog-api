import {Module} from "@nestjs/common";
import {ReplyResolver} from "@src/reply/reply.resolver";
import {ReplyService} from "@src/reply/reply.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Reply} from "@src/entities";
import {HashidsModule} from "@src/hashids/hashids.module";
import {ExternalModule} from "@src/externalApi/external.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Reply]),
        HashidsModule,
        ExternalModule
    ],
    providers: [
        ReplyResolver,
        ReplyService,

    ],
    exports: [
        ReplyService
    ]
})

export class ReplyModule {

}
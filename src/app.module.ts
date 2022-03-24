import {Module} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import path, {join} from "path";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {HitModule} from "@src/hit/hit.module";
import {PostModule} from "@src/post/post.module";
import {HashidsModule} from "@src/hashids/hashids.module";
import {FileModule} from "@src/file/file.module";
import {TagModule} from "@src/tag/tag.module";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {DataLoaderInterceptor, TypeormLoaderMiddleware} from "@webundsoehne/nestjs-graphql-typeorm-dataloader";
import {getConnection} from "typeorm";
import {ReplyModule} from "@src/reply/reply.module";
import {LikeModule} from "@src/like/like.module";
import {ComplexityPlugin} from "@utils/complexity";
import depthLimit from 'graphql-depth-limit';
import {VisitModule} from "@src/visit/visit.module";
import {DateModule} from "@src/date/date.module";
import {ExternalModule} from "@src/externalApi/external.module";
import {PaginationModule} from "@src/pagination/pagination.module";
import {MessageModule} from "@src/message/message.module";
import {GoogleModule} from "@src/google/google.module";
import {AuthModule} from "@src/auth/auth.module";
import {UserModule} from "@src/user/user.module";
import {EncryptModule} from "@src/encrypt/encrypt.module";
import * as config from "../ormconfig";
import {MailModule} from "@src/mail/mail.module";
import {SubscribeModule} from "@src/subscibe/subscribe.module";


@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (): DataLoaderInterceptor => new DataLoaderInterceptor({
        typeormGetConnection: getConnection
      })
    },
    ComplexityPlugin
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "development" ? ".env.development" : ".env.production",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: {
        origin: true,
        credentials: true,
      },
      buildSchemaOptions: {
        fieldMiddleware: [TypeormLoaderMiddleware]
      },
      validationRules: [
        depthLimit(8)
      ],
      context: ({req, res}) => ({req, res}),
    }),
    PostModule,
    HitModule,
    HashidsModule,
    FileModule,
    ReplyModule,
    TagModule,
    LikeModule,
    VisitModule,
    DateModule,
    ExternalModule,
    PaginationModule,
    MessageModule,
    GoogleModule,
    AuthModule,
    UserModule,
    EncryptModule,
    MailModule,
    SubscribeModule
  ],
})


export class AppModule {
}





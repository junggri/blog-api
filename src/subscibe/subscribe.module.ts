import {Module} from "@nestjs/common";
import {SubscribeResolver} from "@src/subscibe/subscribe.resolver";
import {SubscribeService} from "@src/subscibe/subscribe.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscribe} from "@src/entities/Subscribe";

@Module({
  imports: [TypeOrmModule.forFeature([Subscribe])],
  providers: [SubscribeResolver, SubscribeService],
  exports: []
})

export class SubscribeModule {

}
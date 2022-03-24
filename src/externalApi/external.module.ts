import {Module} from "@nestjs/common";
import {ExternalService} from "@src/externalApi/external.service";

@Module({
  imports: [],
  providers: [ExternalService],
  exports: [ExternalService]
})

export class ExternalModule {

}
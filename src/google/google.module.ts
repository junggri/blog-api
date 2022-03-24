import {Module} from "@nestjs/common";
import {GoogleService} from "@src/google/google.service";
import {GoogleResolver} from "@src/google/google.resolver";
import {ExternalModule} from "@src/externalApi/external.module";

@Module({
  imports: [],
  providers: [GoogleResolver, GoogleService],
  exports: []
})

export class GoogleModule {

}
import {Module} from "@nestjs/common";
import {FileService} from "@src/file/file.service";
import {FileResolver} from "@src/file/file.resolver";


@Module({
  imports: [],
  providers: [
    FileResolver,
    FileService,
  ],
  exports: [FileService]
})

export class FileModule {

}
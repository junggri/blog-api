import {Args, Query, Resolver} from '@nestjs/graphql';
import {FileService} from "@src/file/file.service";
import {s3Input} from "@src/file/input/file.input";

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService
  ) {
  }

  @Query(() => String)
  async getS3Image(@Args('data') data: s3Input) {
    return await this.fileService.getS3Data(data)
  }
}

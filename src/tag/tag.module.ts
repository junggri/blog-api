import {Module} from '@nestjs/common';
import {TagResolver} from "@src/tag/tag.resolver";
import {TagService} from "@src/tag/tag.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Tag} from "@src/entities";
import {HashidsModule} from "@src/hashids/hashids.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    HashidsModule
  ],
  providers: [
    TagResolver,
    TagService
  ],
  exports: []
})

export class TagModule {
}
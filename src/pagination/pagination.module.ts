import {Module} from "@nestjs/common";
import {PaginationService} from "@src/pagination/pagination.service";

@Module({
  imports: [],
  providers: [
    PaginationService
  ],
  exports: [
    PaginationService
  ]
})

export class PaginationModule {

}
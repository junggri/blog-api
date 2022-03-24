import {Module} from "@nestjs/common";
import {DateService} from "@src/date/date.service";

@Module({
  imports: [],
  providers: [
    DateService
  ],
  exports: [
    DateService
  ]
})

export class DateModule {
}
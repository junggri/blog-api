import {Module} from "@nestjs/common";
import {VisitService} from "@src/visit/visit.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Visit} from "@src/entities/visit";
import {VisitResolver} from "@src/visit/visit.resolver";
import {DateModule} from "@src/date/date.module";
import {ExternalModule} from "@src/externalApi/external.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Visit]),
    DateModule,
    ExternalModule
  ],
  providers: [
    VisitService,
    VisitResolver
  ],
  exports: []
})

export class VisitModule {
}
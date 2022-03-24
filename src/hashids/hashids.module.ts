import {Global, Module} from "@nestjs/common";
import {HashidsService} from "@src/hashids/hashids.service";

@Global()
@Module({
    imports: [],
    providers: [
        HashidsService
    ],
    exports: [
        HashidsService
    ]
})

export class HashidsModule {

}


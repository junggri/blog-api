import {Injectable} from "@nestjs/common";
import Hashids from "hashids"
import {ConfigService} from "@nestjs/config";

@Injectable()
export class HashidsService {
    public static instance: HashidsService
    private hashids: Hashids


    constructor(config: ConfigService) {
        this.hashids = new Hashids(config.get("HASHID_SALT"), 7);
        HashidsService.instance = this;
    }

    encode(id: number) {
        return this.hashids.encode(id)
    }

    decode(hashId: string): number | undefined {
        return this.hashids.decode(hashId)[0] as number
    }
}
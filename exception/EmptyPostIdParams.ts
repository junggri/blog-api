import {ApolloError} from "apollo-server-express";

export class EmptyPostIdParams extends ApolloError {
    constructor() {
        super("포스트 식별자가 존재하지 않습니다.", "NO_IDENTIFIER");
    }
}
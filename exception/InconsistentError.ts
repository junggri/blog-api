import {ApolloError} from "apollo-server-express";

export class InconsistentError extends ApolloError {
    constructor() {
        super("일치하는 포스트가 없습니다", "NOT_FOUND");
    }
}
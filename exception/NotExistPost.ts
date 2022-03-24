import {ApolloError} from "apollo-server-express";

export class NotExistPost extends ApolloError {
    constructor() {
        super('포스트가 존재하지 않습니다.');
    }
}
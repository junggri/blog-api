import {ApolloError} from "apollo-server-express";

export class FailCreatePost extends ApolloError {
    constructor() {
        super("포스트를 생성할 수 없습니다.", "Fail to created post");
    }
}
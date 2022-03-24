import {ApolloError} from "apollo-server-express";

export class S3uploadError extends ApolloError {
    constructor() {
        super("s3 업로드에 실패하였습니다.", "S3_ERROR");
    }
}
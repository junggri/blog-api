import {ReadStream} from "fs";
import {Field, InputType} from "@nestjs/graphql";

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string

  createReadStream(): ReadStream
}

export interface S3Params {
  path: string
  filename: string
  mimetype: string
  body: ReadStream | string
}

@InputType()
export class s3Input {
  @Field()
  path: string

  @Field()
  data: string
}


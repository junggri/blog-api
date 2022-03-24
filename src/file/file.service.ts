import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import AWS, {S3} from "aws-sdk";
import {FileUpload, s3Input, S3Params} from "@src/file/input/file.input";
import {S3uploadError} from "@exception/S3uploadError";
import {AVAILABLE_MIMETYPES} from "@utils/constant";

@Injectable()
export class FileService {
  private s3 = new AWS.S3({
    accessKeyId: this.configService.get('S3_ACCESS_ID'),
    secretAccessKey: this.configService.get('S3_SECRET_KEY'),
    region: this.configService.get('S3_REGION')
  });


  constructor(private readonly configService: ConfigService) {
  }


  async upsertImage(data: FileUpload) {
    if (!AVAILABLE_MIMETYPES.includes(data.mimetype)) {
      throw new Error("유요하지 않은 이미지 파일확장자입니다.");
    }

    const input: Partial<S3Params> = {
      filename: data.filename,
      body: data.createReadStream(),
      mimetype: data.mimetype,
      path: 'image/',

    };
    await this.uploadToS3(input);

  }


  async upsertContent(content: string, filename: string) {
    const input: Partial<S3Params> = {
      filename: `${filename}.txt`,
      body: content,
      mimetype: "text/plain",
      path: "content/"
    };

    await this.uploadToS3(input);
  }

  async uploadToS3(data: Partial<S3Params>) {
    const input = {
      'Bucket': this.configService.get("BUCKET_NAME"),
      "ACL": "public-read",
      "Key": data.path + data.filename,
      "Body": data.body,
      "ContentType": data.mimetype
    };

    try {
      return await this.s3.upload(input).promise();
    } catch (e) {
      console.error(e);
      throw new S3uploadError();
    }
  }


  async getS3Data(data: s3Input) {
    const input: S3.Types.GetObjectRequest = {
      'Bucket': this.configService.get("BUCKET_NAME"),
      "Key": data.path + "/" + `${data.data}.txt`
    };

    try {
      const result = await this.s3.getObject(input).promise();
      return {hashId: data.data, data: result.Body.toString()};
    } catch (e) {
      console.error(e);
    }
  }

}
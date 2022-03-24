import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Reply} from "@src/entities";
import {Repository} from "typeorm";
import {ReplyCreateInput, ReplyDeleteInput, ReplyInput} from "@src/reply/input/reply.input";
import {HashidsService} from "@src/hashids/hashids.service";
import {ExternalService} from "@src/externalApi/external.service";


@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    private readonly hashIdService: HashidsService,
    private readonly externalApi: ExternalService
  ) {

  }


  async getReply(data: ReplyInput) {

    const isExistHashId = !!data.hashId;
    const postId = this.hashIdService.decode(data.hashId);

    if (isExistHashId && !postId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    const result = await this.replyRepository
      .createQueryBuilder('reply')
      .select()
      .where("reply.post_id = :id", {id: postId})
      .andWhere('parent_id is NULL')
      .getMany();

    console.log(result);
    return result;
  }


  async upsertReply(data: ReplyCreateInput) {
    let insertResult;

    const isExistHashId = !!data.hashId;
    const isExistReplyHashId = !!data.replyHashId;

    const postId = this.hashIdService.decode(data.hashId);
    const replyId = this.hashIdService.decode(data.replyHashId);


    if (isExistHashId && !postId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    if (isExistReplyHashId && !replyId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    if (replyId) {
      const updateResult = await this.replyRepository
        .createQueryBuilder('reply')
        .update()
        .set({
          comment: data.comment
        })
        .where("reply.id = :id", {id: replyId})
        .andWhere("post.id =:id", {id: postId})
        .execute();

      if (!updateResult.affected) {
        throw new Error("존재하지 않는 댓글입니다.");
      }

      return this.replyRepository
        .createQueryBuilder('reply')
        .select()
        .where("reply.id = :id", {id: replyId})
        .getOne();
    }


    if (!data.parentId) {
      const replySummary = await this.replyRepository
        .createQueryBuilder('reply')
        .select("COUNT(DISTINCT bgroup)", "bgroup")
        .addSelect("COUNT(*)", "sorts")
        .where("reply.post_id = :id", {id: postId})
        .getRawOne();

      insertResult = await this.replyRepository
        .createQueryBuilder('reply')
        .insert()
        .values({
          bgroup: parseInt(replySummary.bgroup) + 1,
          sorts: 0,
          depth: 1,
          comment: data.comment,
          writer: data.writer,
          postId: postId,
          parentId: data.parentId
        })
        .execute();

    } else {
      const replySummary = await this.replyRepository
        .createQueryBuilder('reply')
        .select()
        .where("reply.id = :parentId", {parentId: data.parentId})
        .getOne();

      if (!replySummary) {
        throw new Error("유효하지 않은 접근입니다.");
      }

      await this.replyRepository
        .createQueryBuilder('reply')
        .update()
        .set({
          sorts: () => "sorts + 1"
        })
        .where("reply.sorts > :sorts", {sorts: replySummary.sorts})
        .andWhere("reply.bgroup = :bgroup", {bgroup: replySummary.bgroup})
        .execute();

      insertResult = await this.replyRepository
        .createQueryBuilder('reply')
        .insert()
        .values({
          bgroup: replySummary.bgroup,
          sorts: replySummary.sorts + 1,
          depth: replySummary.depth + 1,
          comment: data.comment,
          writer: data.writer,
          postId: postId,
          parentId: data.parentId
        })
        .execute();
    }


    const smsData = {
      name: data.writer,
      content: data.comment,
      title: data.postTitle
    };

    await this.externalApi.sendSMS(smsData);

    const reply = await this.replyRepository
      .createQueryBuilder('reply')
      .select()
      .where("reply.id = :id", {id: insertResult.identifiers[0].id})
      .getOne();

    return reply;
  }


  async deleteReply(data: ReplyDeleteInput) {
    const isExistHashId = !!data.hashId;
    const postId = this.hashIdService.decode(data.hashId);

    if (isExistHashId && !postId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    await this.replyRepository
      .createQueryBuilder('reply')
      .softDelete()
      .where("reply.id in (:ids)", {ids: data.replyIds})
      .execute();

  }
}
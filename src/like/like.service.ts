import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Likes} from "@src/entities";
import {Repository} from "typeorm";
import {LikeInput} from "@src/like/input/like.input";
import {Response} from 'express';
import {v4} from "uuid";
import {HashidsService} from "@src/hashids/hashids.service";
import {SIX_MONTHS} from "@utils/constant";


@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Likes) private readonly likeRepository: Repository<Likes>,
    private readonly hashIdsService: HashidsService
  ) {
  }

  parseCookie(value: string | undefined) {
    if (!value) {
      return [];
    }

    return Buffer.from(unescape(value), "base64")
      .toString("ascii")
      .split('/_/g')
      .filter((i) => i);
  }

  async createLike(res: Response, data: LikeInput) {
    const request = res.req
    const likeIdentifier = request.cookies['like_identifier'];
    const identifier = likeIdentifier ? likeIdentifier : v4();

    const cookie = request.cookies['like_post'];

    const likePostArray = this.parseCookie(cookie);
    const inputPostId = this.hashIdsService.decode(data.postHashId);


    if (!inputPostId) {
      throw new Error("유요하지 않은 접근입니다.")
    }

    const isExistIdentifier = await this.likeRepository
      .createQueryBuilder('like')
      .select()
      .where('like.identifier = :identifier', {identifier: identifier})
      .andWhere('like.post_id = :post_id', {post_id: inputPostId})
      .getOne()


    if (isExistIdentifier) {
      await this.likeRepository
        .createQueryBuilder("like")
        .delete()
        .from(Likes)
        .where('post_id = :post_id', {post_id: inputPostId})
        .execute()

      const organizedArray = likePostArray[0].split("_")

      const idx = organizedArray.indexOf(data.postHashId);
      if (idx !== -1) {
        organizedArray.splice(idx, 1)

        res.cookie(
          "like_post", Buffer.from([organizedArray].join('_')).toString("base64"),
          {httpOnly: true, secure: true, maxAge: SIX_MONTHS}
        );
      }
      return organizedArray

    } else {
      const insertResult = await this.likeRepository
        .createQueryBuilder('like')
        .insert()
        .into(Likes)
        .values({
          identifier: identifier,
          postId: inputPostId
        })
        .execute()

      const like = await this.likeRepository
        .createQueryBuilder('like')
        .select()
        .where("id = :id", {id: insertResult.identifiers[0].id})
        .getOne();
      if (like) {
        res.cookie(
          "like_post", Buffer.from([...likePostArray, data.postHashId].join('_')).toString("base64"),
          {httpOnly: true, secure: true, maxAge: SIX_MONTHS}
        );
        res.cookie('like_identifier', identifier, {httpOnly: true, secure: true, maxAge: SIX_MONTHS});
        if (likePostArray[0]) {
          return [...likePostArray[0].split("_"), data.postHashId]
        } else {
          return [data.postHashId]
        }
      }
    }

  }

  async getList(res: Response) {
    const likePost = this.parseCookie(res.req.cookies["like_post"]);
    if (likePost.length) {
      return likePost[0].split("_")
    }
    return likePost
  }
}
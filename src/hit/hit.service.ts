import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {EntitySubscriberInterface, EventSubscriber, Repository} from "typeorm";
import {Hit} from "@src/entities";
import {DashBoardFrequency, DashBoardInput, HitInput} from "@src/hit/input/hit.input";
import {Response} from "express";
import {HashidsService} from "@src/hashids/hashids.service";
import {v4} from "uuid";
import {ONE_YEAR} from "@utils/constant";
import {PostService} from "@src/post/post.service";
import {DateService} from "@src/date/date.service";


function getDateByFrequency(frequency: DashBoardFrequency) {
  switch (frequency) {
    default:
    case DashBoardFrequency.ONE_MONTH:
      return initialDate(1);
    case DashBoardFrequency.THREE_MONTH:
      return initialDate(3);
    case DashBoardFrequency.SIX_MONTH:
      return initialDate(6);
  }
}

function initialDate(minusMonth: number) {
  const today = new Date();
  const before = new Date(today.getFullYear(), today.getMonth() - minusMonth, today.getDate(), 0, 0, 0);
  const after = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
  return {before, after};
}

@Injectable()
@EventSubscriber()
export class HitService implements EntitySubscriberInterface<Hit> {
  constructor(
    @InjectRepository(Hit) private hitRepository: Repository<Hit>,
    private readonly hashIdsService: HashidsService,
    private readonly postService: PostService,
    private readonly dateService: DateService
  ) {
  }

  listenTo(): Function | string {
    return Hit;
  }

  parseCookie(value: string | undefined) {
    if (!value) {
      return [];
    }

    return Buffer.from(unescape(value), "base64")
      .toString("ascii")
      .split(/_/g)
      .filter((i) => i);
  }

  async getDashBoard(hashId: string, data: DashBoardInput) {

    const postId = this.hashIdsService.decode(hashId);

    if (!postId) {
      throw new Error("존재하지 않는 포스트입니다.");
    }

    const {before, after} = this.dateService.calculateDate(data.frequency);


    const result = await this.hitRepository
      .createQueryBuilder('hit')
      .leftJoinAndSelect('hit.post', 'post')
      .where("post.id = :id", {id: postId})
      .andWhere("hit.created_at >= :before", {before})
      .andWhere("hit.created_at < :after", {after})
      .getMany();

    return result;

  }

  async createHit(res: Response, data: HitInput) {
    const hitIdentifier = res.req.cookies['identifier'];
    const identifier = hitIdentifier || v4();

    const visitedPost = this.parseCookie(
      res.req.cookies["viewed_post"]
    );

    if (visitedPost.length > 100) {
      visitedPost.splice(0, 1);
    }

    if (visitedPost.indexOf(data.postHashId) !== -1) {
      return null;
    }

    const postId: number = await this.hashIdsService.decode(data.postHashId);

    if (!postId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    const post = await this.postService.findById(data.postHashId);

    if (!post) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    const insertResult = await this.hitRepository
      .createQueryBuilder("hit")
      .insert()
      .into(Hit)
      .values({
        postId,
        identifier,
      })
      .execute();


    const hit = await this.hitRepository
      .createQueryBuilder("hit")
      .select()
      .where("hit.id = :id", {id: insertResult.identifiers[0].id})
      .getOne();

    if (hit) {
      res.cookie(
        "viewed_post",
        Buffer.from([...visitedPost, data.postHashId].join('_')).toString("base64"),
        {maxAge: ONE_YEAR}
      );
    }

    if (!hitIdentifier) {
      res.cookie('identifier', identifier, {maxAge: ONE_YEAR});
    }

    return "created";
  }


}
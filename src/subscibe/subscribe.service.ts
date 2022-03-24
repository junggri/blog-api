import {Injectable} from "@nestjs/common";
import {Subscribe, SubscribeInput} from "@src/entities/Subscribe";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Response} from "express"
import {SIX_MONTHS} from "@utils/constant";
import {MAX_COOKIE_VALUE} from "cores/constant";

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe) private repository: Repository<Subscribe>,
  ) {

  }

  async isSubscribe(res: Response) {
    const cookie = res.req.cookies["subscribe"]

    if (!cookie) {
      return false
    }

    const isSubscribe = await this.repository
      .createQueryBuilder()
      .select()
      .where("subscribe.name = :name", {name: cookie.name})
      .andWhere("subscribe.email = :email", {email: cookie.email})
      .andWhere("subscribe.phone_number = :phone_number", {phone_number: cookie.phoneNumber})
      .getOne()

    if (!isSubscribe && cookie) {
      res.clearCookie("subscribe")
    }

    return !!isSubscribe
  }

  async subscribe(res: Response, data: SubscribeInput) {
    const isSubscribed = await this.repository
      .createQueryBuilder("subscribe")
      .select()
      .where("subscribe.name = :name", {name: data.name})
      .andWhere("subscribe.email = :email", {email: data.email})
      .getOne()

    if (isSubscribed) {
      throw new Error("이미 구독을 신청하셨습니다")
    }

    const insertResult = await this.repository
      .createQueryBuilder()
      .insert()
      .into(Subscribe)
      .values({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber
      })
      .execute();

    if (insertResult) {
      const result = await this.repository
        .createQueryBuilder()
        .select()
        .where("subscribe.name = :name", {name: data.name})
        .andWhere("subscribe.email = :email", {email: data.email})
        .andWhere("subscribe.phone_number = :phone_number", {phone_number: data.phoneNumber})
        .getOne()

      res.cookie(
        "subscribe", data,
        {httpOnly: true, secure: true, maxAge: MAX_COOKIE_VALUE}
      );
      return result
    }
  }

  async unsubscribe(res: Response) {
    console.log(res.req.cookies['subscribe'])
    const cookie = res.req.cookies['subscribe']

    const isSubscribed = await this.repository
      .createQueryBuilder("subscribe")
      .select()
      .where("subscribe.name = :name", {name: cookie.name})
      .andWhere("subscribe.email = :email", {email: cookie.email})
      .andWhere("subscribe.phone_number = :phone_number", {phone_number: cookie.phoneNumber})
      .getOne();


    if (!isSubscribed) {
      throw new Error("구독 정보가 없습니다.")
    }

    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Subscribe)
      .where("subscribe.name = :name", {name: cookie.name})
      .andWhere("subscribe.email = :email", {email: cookie.email})
      .andWhere("subscribe.phone_number = :phone_number", {phone_number: cookie.phoneNumber})
      .execute()

    if (result) {
      res.clearCookie("sub");
      return true
    }
  }
}

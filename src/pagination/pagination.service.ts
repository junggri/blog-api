import {Injectable} from "@nestjs/common";
import {PaginationInput} from "@src/pagination/input/pagination.input";
import {SelectQueryBuilder} from "typeorm/query-builder/SelectQueryBuilder";
import {Post} from "@src/entities";
import {PageInfo} from "@src/entities/pagination";

@Injectable()
export class PaginationService {
  async pagination(
    {first, after, filter}: PaginationInput,
    query: SelectQueryBuilder<Post>
  ) {
    const countQuery = query.clone();

    query.take(first);
    query.orderBy("post.id", "DESC");

    //open => 공개 비공기
    //is_published => 저장 임시저장
    if (filter === "open") {
      query.where("open = :open", {open: 1});
    } else if (filter === "close") {
      query.where("open = :open", {open: 0});
      query.andWhere("is_published = :is_published", {is_published: 1});
    } else {
      query.where("is_published = :is_published", {is_published: 0});
      query.andWhere("open = :open", {open: 0});
    }

    if (after) {
      query.andWhere("post.id < :id", {id: after});
    }

    const result = await query.getMany();

    const endCursorId = result.length > 0 ? result.slice(-1)[0].id : null;

    await countQuery
      .where("post.id < :id", {id: endCursorId})

    if (filter === "open") {
      await countQuery.andWhere("open = :open", {open: 1})
    } else if (filter === "close") {
      await countQuery.andWhere("open = :open", {open: 0})
    } else {
      await countQuery.andWhere("is_published = :is_published", {is_published: 0})
    }

    const leftCount = await countQuery.getCount()

    const edges = result.map((e) => {
      return {
        cursor: e.id,
        node: e
      };
    });

    const pageInfo = new PageInfo();
    pageInfo.endCursor = edges.length ? edges.slice(-1)[0].cursor : null;
    pageInfo.hasNextPage = leftCount > 0;

    return {leftCount, edges, pageInfo};
  }
}

import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Tag} from "@src/entities";
import {Repository} from "typeorm";
import {TagDeleteInput, TagInput} from "@src/tag/input/tag.input";
import {HashidsService} from "@src/hashids/hashids.service";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private readonly hashIdsService: HashidsService
  ) {
  }

  async getTags() {
    return await this.tagRepository
      .createQueryBuilder("tag")
      .select()
      .getMany();
  }

  async upsertTag(data: TagInput) {
    const isExistHashId = !!data.hashId;
    const tagId = this.hashIdsService.decode(data.hashId);

    if (isExistHashId && !tagId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    if (tagId) {
      const updateResult = await this.tagRepository
        .createQueryBuilder("tag")
        .update()
        .set({
          tag: data.tagName
        })
        .where('tag.id = :id', {id: tagId})
        .execute();

      if (!updateResult.affected) {
        throw new Error("존재하지 않는 테그입니다.");
      }

      return await this.tagRepository
        .createQueryBuilder("tag")
        .select()
        .where('tag.id = :id', {id: tagId})
        .getOne();
    }

    const tags = await this.tagRepository
      .createQueryBuilder("tag")
      .select("tag")
      .getMany();

    const existTag = tags.map((e) => e.tag).includes(data.tagName);

    if (existTag) {
      return "exist already";
    }

    const insertResult = await this.tagRepository
      .createQueryBuilder("tag")
      .insert()
      .values({
        tag: data.tagName
      })
      .execute();


    const tag = await this.tagRepository
      .createQueryBuilder("tag")
      .select()
      .where("tag.id = :id", {id: insertResult.identifiers[0].id})
      .getOne();

    return tag;
  }


  async deleteTag(data: TagDeleteInput) {
    const isExistHashId = !!data.hashId;
    const tagId = this.hashIdsService.decode(data.hashId);

    if (isExistHashId && !tagId) {
      throw new Error("유효하지 않은 접근입니다.");
    }

    const deleteResult = await this.tagRepository
      .createQueryBuilder("tag")
      .delete()
      .where("tag .id = :id", {id: tagId})
      .execute();

    return deleteResult.affected;
  }
}
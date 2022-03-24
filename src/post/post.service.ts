import {Injectable} from '@nestjs/common';
import {Hit, Post, Tag} from "@src/entities";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, EntitySubscriberInterface, EventSubscriber, Repository} from "typeorm";
import {PostInput} from "@src/post/input/post.input";
import {NotExistPost} from "@exception/NotExistPost";
import {HashidsService} from "@src/hashids/hashids.service";
import {FileService} from "@src/file/file.service";
import {FileUpload} from "@src/file/input/file.input";
import path from "path";
import * as faker from "faker";
import {PaginationInput} from "@src/pagination/input/pagination.input";
import {PaginationService} from "@src/pagination/pagination.service";
import {MessageService} from "@src/message/message.service";

@Injectable()
@EventSubscriber()
export class PostService implements EntitySubscriberInterface<Post> {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly hashIdsService: HashidsService,
    private readonly fileService: FileService,
    private readonly paginationService: PaginationService,
  ) {
  }

  listenTo(): Function | string {
    return Post;
  }

  async getHashIds() {

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .select("post.id")
      .getMany();

    return posts.map((e) => {
      return this.hashIdsService.encode(e.id);
    });
  }

  async findAllPost(paginationArg: PaginationInput) {
    let contentTable = {};

    const isExist = await this.postRepository.createQueryBuilder('post').getMany();

    if (!isExist.length) {
      return null
    }

    const query = this.postRepository
      .createQueryBuilder('post');

    const {leftCount, edges, pageInfo} = await this.paginationService.pagination(paginationArg, query);

    const promises = edges.map((e) => {
      return new Promise((resolve) => {
        resolve(this.fileService.getS3Data({
          path: "content",
          data: this.hashIdsService.encode(e.node.id)
        }));
      });
    });

    const contents = await Promise.all(promises);

    contents.forEach((e: { hashId: string, data: string }) => {
      contentTable[e.hashId] = e.data;
    });

    edges.map((e) => {
      e.node.content = contentTable[e.node.hashId];
    });

    return {leftCount, edges, pageInfo};
  }

  async findById(hashId: string) {
    const postId = this.hashIdsService.decode(hashId);

    if (!postId) {
      throw new Error("존재하지 않는 포스트입니다.");
    }

    const contents = await this.fileService.getS3Data({path: "content", data: hashId});
    const originalContent = await this.fileService.getS3Data({path: "content", data: hashId + "_original"});

    const data = await this.postRepository
      .createQueryBuilder("post")
      .select()
      .where("post.id =:id", {id: postId})
      .getOne();

    data.originalContent = originalContent.data
    data.content = contents.data;
    return data;
  }

  async deletePost(hashId: string) {

    const postId = this.hashIdsService.decode(hashId);

    if (!postId) {
      throw new Error("존재하지 않는 포스트입니다.");
    }

    const target = await this.postRepository.createQueryBuilder('post')
      .select()
      .where("post.id = :id", {id: postId})
      .getOne();

    if (!target) {
      throw new NotExistPost();
    }

    const data: DeleteResult = await this.postRepository
      .createQueryBuilder('post')
      .delete()
      .from(Post)
      .where("id = :id", {id: postId})
      .execute();


    return data.affected;
  }

  async toPrivate(hashId: string) {
    const postId = this.hashIdsService.decode(hashId);

    if (!postId) {
      throw new Error("존재하지 않는 포스트입니다.");
    }

    const target = await this.postRepository
      .createQueryBuilder('post')
      .select()
      .where("id = :id", {id: postId})
      .getOne();


    if (!target.open) {
      throw new Error("이미 비공개된 포스트입니다.");
    }


    const data = await this.postRepository
      .createQueryBuilder('post')
      .update(Post)
      .set({open: false})
      .where("id = :id", {id: postId})
      .execute();

    return data.affected;
  }


  async upsertPost(post: PostInput, file: FileUpload) {

    let insertResult;
    const isExistHashId = !!post.hashId;
    const isExistThumbnail = !!post.thumbnail;

    let s3Filename = post.hashId;
    let s3ImageName = post.thumbnail; //null or string

    let postId = this.hashIdsService.decode(post.hashId);

    if (isExistHashId && !postId || isExistThumbnail && !postId) {
      throw new Error("유효하지 않은 접근입니다.");
    }


    if (file) {
      s3ImageName = s3ImageName || new Date().valueOf() + path.extname(file.filename);
      await this.fileService.upsertImage({...file, filename: s3ImageName});
    }


    if (this.hashIdsService.decode(post.hashId)) {
      await this.postRepository
        .createQueryBuilder('post')
        .update(Post)
        .where("post.id = :id", {id: postId})
        .set({
          title: post.title,
          desc: post.desc,
          open: post.open,
          thumbnail: s3ImageName
        })
        .execute();
    } else {
      insertResult = await this.postRepository
        .createQueryBuilder('post')
        .insert()
        .into(Post)
        .values({
          title: post.title,
          desc: post.desc,
          open: post.open,
          isPublished: post.is_published,
          thumbnail: s3ImageName,
        })
        .execute();


      s3Filename = this.hashIdsService.encode(insertResult.identifiers[0].id);
      postId = insertResult.identifiers[0].id;
    }

    await this.upsertPostTag(postId, post.tagIds);
    await this.fileService.upsertContent(post.content, s3Filename);
    await this.fileService.upsertContent(post.originalContent, s3Filename + "_original");

    const upsertPost = await this.postRepository
      .createQueryBuilder('post')
      .select()
      .where("post.id = :id", {id: postId})
      .getOne();

    return upsertPost;
  }

  async upsertPostTag(postId: number, tags: number[]) {
    const hashTable = {};
    let filter;


    const savedTags = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect("post.tag", 'tag')
      .where('post.id = :id', {id: postId})
      .getOne();


    if (tags.length < savedTags.tagId.length) {
      tags.forEach((e) => {
        hashTable[e.toString()] = true;
      });

      filter = savedTags.tagId.filter(e => {
        return !hashTable[e.toString()];
      });

      for (let i = 0; i < filter.length; i++) {
        await this.postRepository
          .createQueryBuilder('post')
          .delete()
          .from("post_tag")
          .where("post_id = :id", {id: postId})
          .andWhere("tag_id = :tagId", {tagId: filter[i]})
          .execute();
      }

    } else {
      savedTags.tagId.forEach((e) => {
        hashTable[e.toString()] = true;
      });

      filter = tags.filter(e => {
        return !hashTable[e.toString()];
      });

      for (let i = 0; i < filter.length; i++) {
        await this.postRepository
          .createQueryBuilder('post')
          .insert()
          .into('post_tag')
          .values({
            'post_id': postId,
            'tag_id': filter[i]
          })
          .execute();
      }
    }


  }


  async onApplicationBootstrap(): Promise<void> {

    if (process.env.NODE_ENV === "production") {
      return
    }

    for (let i = 0; i < 15; i++) {

    }

    for (let i = 0; i < 7; i++) {
      await this.postRepository.createQueryBuilder('post')
        .insert()
        .into(Post)
        .values({
          createdAt: faker.datatype.datetime(),
          updatedAt: faker.datatype.datetime(),
          title: `${i + 1}`,
          desc: faker.lorem.sentence(),
          originalContent: faker.lorem.sentence(),
          content: faker.lorem.sentence(),
          thumbnail: faker.lorem.sentence(),
          // isPublished: faker.random.boolean(),
          open: true,
        })
        .execute();
      await this.fileService.upsertContent(faker.lorem.sentence(), this.hashIdsService.encode(i + 1));
      await this.fileService.upsertContent(faker.lorem.sentence(), this.hashIdsService.encode(i + 1) + "_original");

      for (let j = 0; j < Math.floor(Math.random() * 3); j++) {
        await this.postRepository
          .createQueryBuilder('post')
          .insert()
          .into(Hit)
          .values({
            createdAt: new Date(),
            updatedAt: faker.datatype.datetime(),
            postId: i + 1,
            identifier: `${i + i}글 `
          })
          .execute();
      }
    }

    for (let i = 0; i < 4; i++) {
      await this.postRepository
        .createQueryBuilder('post')
        .insert()
        .into(Tag)
        .values({
          tag: (i + 1) + "태그",
        })
        .execute();
    }

    for (let i = 0; i < 3; i++) {
      await this.postRepository
        .createQueryBuilder('post')
        .insert()
        .into("post_tag")
        .values({
          "post_id": 1,
          "tag_id": i + 1,
        })
        .execute();
    }

    for (let i = 0; i < 2; i++) {
      await this.postRepository
        .createQueryBuilder('post')
        .insert()
        .into("post_tag")
        .values({
          "post_id": 2,
          "tag_id": i + 1,
        })
        .execute();
    }

    for (let i = 0; i < 4; i++) {
      await this.postRepository
        .createQueryBuilder('post')
        .insert()
        .into("post_tag")
        .values({
          "post_id": 3,
          "tag_id": i + 1,
        })
        .execute();
    }

    //
    // for (let i = 0; i < 2; i++) {
    //   for (let j = 0; j < 5; j++) {
    //     await this.postRepository
    //       .createQueryBuilder('post')
    //       .insert()
    //       .into(Reply)
    //       .values({
    //         bgroup: 1,
    //         sorts: i,
    //         depth: i,
    //         comment: "test" + j + '글',
    //         writer: "lee",
    //         postId: j + 1,
    //         parentId: i === 0 ? null : i
    //       })
    //       .execute();
    //
    //   }
    // }
  }
}

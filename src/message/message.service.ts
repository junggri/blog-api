import {Injectable} from "@nestjs/common";
import {MessageInput, MessageReplyInput} from "@src/message/input/message.input";
import {InjectRepository} from "@nestjs/typeorm";
import {Message, Post} from "@src/entities";
import {Repository} from "typeorm";
import {ExternalService} from "@src/externalApi/external.service";
import faker from "faker";
import {MailService} from "@src/mail/mail.service";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly externalApi: ExternalService,
    private readonly mailService: MailService
  ) {
  }

  async createMessage(data: MessageInput) {
    await this.messageRepository
      .createQueryBuilder('message')
      .insert()
      .into(Message)
      .values({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        content: data.content
      })
      .execute()

    const smsData = {
      name: data.name,
      content: data.content
    };

    await this.externalApi.sendSMS(smsData);

    return "created";
  }

  async getMessage() {
    const data = await this.messageRepository
      .createQueryBuilder("message")
      .getMany()

    return data
  }

  async replyMessage(data: MessageReplyInput) {
    await this.mailService.sendMail(data)
    return "success"
  }

  async onApplicationBootstrap(): Promise<void> {
    if (process.env.NODE_ENV === "production") {
      return
    }

    for (let i = 0; i < 15; i++) {
      await this.messageRepository.createQueryBuilder('message')
        .insert()
        .into(Message)
        .values({
          name: "Asd",
          email: "jjuu6933@naver.com",
          phoneNumber: '01077625',
          content: `${faker.lorem.paragraph()}`
        })
        .execute()
    }

  }
}
import {Injectable} from "@nestjs/common";
import nodemailer from 'nodemailer'
import {MessageReplyInput} from "@src/message/input/message.input";

@Injectable()
export class MailService {
  constructor() {
  }

  async sendMail(data: MessageReplyInput) {

    console.log(process.env.GMAIL, process.env.GAMIL_PASSWORD)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GAMIL_PASSWORD,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.GMAIL,
      to: process.env.NODE_ENV === "development" ? "jjuu6933@naver.com" : data.email,
      subject: data.subject,
      text: "정그리님의 답장입니다.",
      html: `<div>${data.content}</div>`
    })
    console.log(info)
  }
}
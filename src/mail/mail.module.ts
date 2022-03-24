import {Module} from "@nestjs/common";
import {MailService} from "@src/mail/mail.service";

@Module({
  imports: [],
  exports: [MailService],
  providers: [MailService]
})

export class MailModule {

}
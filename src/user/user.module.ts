import {Module} from "@nestjs/common";
import {UserResolver} from "@src/user/user.resolver";
import {UserService} from "@src/user/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Tag} from "@src/entities";
import {User} from "@src/entities/user";
import {EncryptModule} from "@src/encrypt/encrypt.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EncryptModule
  ],
  providers: [UserResolver, UserService],
  exports: [UserService]
})

export class UserModule {

}
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Tag} from "@src/entities";
import {Repository} from "typeorm";
import {User} from "@src/entities/user";
import {EncryptService} from "@src/encrypt/encrpyt.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly encryptService: EncryptService,
    private readonly configService: ConfigService
  ) {
  }

  async findUser(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .select()
      .where("user.username = :username", {username: username})
      .getOne();
  }


  async onApplicationBootstrap() {
    console.log(process.env.NODE_ENV)
    if(process.env.NODE_ENV==="development"){
    const hash = await this.encryptService.getHash()

    await this.userRepository
      .createQueryBuilder('user')
      .insert()
      .into(User)
      .values({
        username: process.env.NAME,
        hash: hash
      })
      .execute()
    }
  }

}
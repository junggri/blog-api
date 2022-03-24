import {Injectable} from "@nestjs/common";
import {UserService} from "@src/user/user.service";
import {JwtService} from "@nestjs/jwt";
import {UserInput} from "@src/user/input/user.input";
import {EncryptService} from "@src/encrypt/encrpyt.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService
  ) {
  }

  async validationUser(data: UserInput) {
    const user = await this.userService.findUser(data.username)

    if (!user) {
      return null
    }

    const match = await this.encryptService.compare(data.password, user.hash)

    if (!match) {
      return   null
    }
    return match
  }

  async login(data: UserInput) {
    const payload = {username: data.username}
    return {
      access_token: this.jwtService.sign(payload)
    }
  }


}
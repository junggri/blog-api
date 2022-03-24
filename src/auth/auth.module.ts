import {Module} from "@nestjs/common";
import {AuthService} from "@src/auth/auth.service";
import {AuthResolver} from "@src/auth/auth.resolver";
import {UserModule} from "@src/user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {EncryptModule} from "@src/encrypt/encrypt.module";
import {JwtStrategy} from "@src/auth/strategy/jwt.strategy";


@Module({
  imports: [
    UserModule,
    ConfigService,
    EncryptModule,
    JwtModule.registerAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get("JWT_SECRETKEY"),
          signOptions: {expiresIn: '1d'},
        }
      }
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy
  ],
  exports: [AuthService]
})
export class AuthModule {
}
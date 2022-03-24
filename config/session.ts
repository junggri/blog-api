import connectRedis, {RedisStore} from "connect-redis";
import session, {SessionOptions} from "express-session";
import redis from "redis";
import * as process from "process";



export class Session {
    static create(): SessionOptions {
        const RedisStore: RedisStore = connectRedis(session);

        const _client = redis.createClient({
            host:process.env.SESSION_HOST,
            port: Number(process.env.SESSION_PORT)
        });

        return {
            secret: process.env.SESSION_SECRET_KEY,
            name: "sid",
            resave: false,
            saveUninitialized: true,
            store: new RedisStore({
                client: _client,
                ttl: 60 * 60 * 24
            }),
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            }
        };
    }
}

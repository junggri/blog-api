declare namespace NodeJS {
    interface ProcessEnv {
        PORT: string
        NODE_ENV: string
        SESSION_SECRET_KEY: string
        SESSION_HOST: string
        SESSION_PORT: string
        SMS_API_URI: string
        SMS_API_SECRETKEY: string
        SMS_API_ACCESSKEY: string
        SMS_API_PHONE: string
        CRYPTO_ITER: string
        CRYPTO_NUM: string
        CRYPTO_ALGO: string
        JWT_SECRETKEY: string
        HASHID_SALT: string
        TYPEORM_CONNECTION: string
        TYPEORM_HOST: string
        TYPEORM_USERNAME: string
        TYPEORM_PASSWORD: string
        TYPEORM_DATABASE: string
        TYPEORM_PORT: string
        TYPEORM_DROP_SCHEMA: string
        TYPEORM_SYNCHRONIZE: string
        TYPEORM_LOGGING: string
        TYPEORM_RUN_MIGRATION: string

        GA_VIEW_ID: string
        GA_CLIENT_EMAIL: string
        GA_PRIVATE_KEY: string
        GRAPHQL_ORIGIN: string

        BUCKET_NAME: string
        S3_ACCESS_ID: string
        S3_SECRET_KEY: string
        S3_REGION: string

    }
}


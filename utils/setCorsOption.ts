export default function setCorsOption<T>(_whitelist: T[]) {
    return {
        origin: _whitelist,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 200,
        credentials: true,
    };
}



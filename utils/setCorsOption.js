"use strict";
exports.__esModule = true;
function setCorsOption(_whitelist) {
    return {
        origin: _whitelist,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        optionsSuccessStatus: 204,
        credentials: true
    };
}
exports["default"] = setCorsOption;

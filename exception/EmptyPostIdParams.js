"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.EmptyPostIdParams = void 0;
var apollo_server_express_1 = require("apollo-server-express");
var EmptyPostIdParams = /** @class */ (function (_super) {
    __extends(EmptyPostIdParams, _super);
    function EmptyPostIdParams() {
        return _super.call(this, "포스트 식별자가 존재하지 않습니다.", "NO_IDENTIFIER") || this;
    }
    return EmptyPostIdParams;
}(apollo_server_express_1.ApolloError));
exports.EmptyPostIdParams = EmptyPostIdParams;

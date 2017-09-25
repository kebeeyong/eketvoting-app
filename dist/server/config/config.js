"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var development_1 = require("./env/development");
var production_1 = require("./env/production");
var test_1 = require("./env/test");
var config;
switch (process.env.NODE_ENV) {
    case 'development':
        config = development_1.default;
        break;
    case 'production':
        config = production_1.default;
        break;
    case 'test':
        config = test_1.default;
        break;
    default:
        config = development_1.default;
}
exports.default = config;
//# sourceMappingURL=config.js.map
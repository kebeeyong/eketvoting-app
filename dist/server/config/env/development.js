"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    db: 'mongodb://localhost:27017/voting-app',
    sessionSecret: process.env.SESSION_SECRET || 'devsecretkey'
};
exports.default = config;
//# sourceMappingURL=development.js.map
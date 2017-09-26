"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var OptionSchema = new Schema({
    value: { type: String, required: true },
    votes: { type: Number, default: 0 }
});
var PollSchema = new Schema({
    name: {
        type: String,
        required: 'Poll name is required'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    options: {
        type: [OptionSchema],
        required: 'Poll should have at least 2 options',
        validate: [function (val) {
                return val.length >= 2;
            }, 'Poll should have at least 2 options']
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    ips: [{ type: String }] // ips of users who voted in this poll
});
var Poll = mongoose.model('Poll', PollSchema);
exports.default = Poll;
//# sourceMappingURL=poll.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    email: { type: String,
        unique: true,
        required: 'Email is required',
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: 'Password is required'
    }
});
UserSchema.methods.hashPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
var User = mongoose.model('User', UserSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map
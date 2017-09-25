"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var should = chai.should();
var user_model_1 = require("../../models/user.model");
describe('User model:', function () {
    var name = 'User';
    var email = 'example@example.com';
    var password = '123456qwe';
    var user;
    beforeEach(function () {
        user = new user_model_1.default({ name: name, email: email });
        user.hashPassword(password);
    });
    afterEach(function (done) {
        user_model_1.default.remove({}, done);
    });
    it('should set hashed password', function () {
        should.not.equal(password, user.password);
    });
    it('should check password validity', function () {
        should.equal(user.validPassword(password), true);
    });
    it('should not save user without name', function (done) {
        user.name = '';
        user.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should not save user without email', function (done) {
        user.email = '';
        user.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should not save user without password', function (done) {
        user.password = '';
        user.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should not save user with invalid email', function (done) {
        user.email = 'email';
        user.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should save user', function (done) {
        user.save(function (err) {
            should.not.exist(err);
            done();
        });
    });
});
//# sourceMappingURL=user.model.test.js.map
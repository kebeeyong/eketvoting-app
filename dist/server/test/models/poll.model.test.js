"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var should = chai.should();
var user_model_1 = require("../../models/user.model");
var poll_model_2 = require("../../models/poll.model");
describe('Poll model:', function () {
    var user;
    var poll;
    var userCredentials = {
        name: 'Name',
        email: 'example@example.com',
        password: '123456789'
    };
    beforeEach(function (done) {
        user = new user_model_1.default({ name: userCredentials.name, email: userCredentials.email });
        user.hashPassword(userCredentials.password);
        user.save(function () {
            poll = new poll_model_2.default({
                name: 'Poll name',
                createdBy: user,
                options: [
                    { value: 'option 1' },
                    { value: 'option 2' }
                ]
            });
            done();
        });
    });
    afterEach(function (done) {
        user_model_1.default.remove({}, function () {
            poll_model_2.default.remove({}, done);
        });
    });
    it('should not save poll without name', function (done) {
        poll.name = '';
        poll.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should not save poll without createdBy', function (done) {
        poll.createdBy = '';
        poll.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should not save poll without options', function (done) {
        poll.options = null;
        poll.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should not save poll when there are less than 2 options', function (done) {
        poll.options = [{ value: 'option 1', votes: 0 }];
        poll.save(function (err) {
            should.exist(err);
            done();
        });
    });
    it('should save poll without problems', function (done) {
        poll.save(function (err) {
            should.not.exist(err);
            done();
        });
    });
});
//# sourceMappingURL=poll.model.test.js.map
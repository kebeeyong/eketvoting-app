"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chaiHttp = require("chai-http");
var app_1 = require("../../app");
var user_model_1 = require("../../models/user.model");
var poll_model_1 = require("../../models/poll.model");
chai.use(chaiHttp);
var should = chai.should();
describe('Poll controller', function () {
    var userCredentials = {
        name: 'User',
        email: 'example@example.com',
        password: '123456789'
    };
    var user, poll;
    beforeEach(function (done) {
        user = new user_model_1.default({
            name: userCredentials.name,
            email: userCredentials.email
        });
        user.hashPassword(userCredentials.password);
        user.save(function () {
            poll = new poll_model_1.default({
                name: 'Poll name',
                createdBy: user,
                options: [
                    { value: 'option 1' },
                    { value: 'option 2' }
                ]
            });
            poll.save(done);
        });
    });
    afterEach(function (done) {
        poll_model_1.default.remove({}, function () {
            user_model_1.default.remove({}, done);
        });
    });
    describe('route /api/polls', function () {
        var newPollData = {
            name: 'New poll name',
            createdBy: user,
            options: [
                { value: 'option 1' },
                { value: 'option 2' }
            ]
        };
        it('should be able to retrieve all polls', function (done) {
            chai.request(app_1.app)
                .get('/api/polls')
                .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(1);
                should.equal(poll.name, res.body[0].name);
                done();
            });
        });
        it('should not be able to create a new poll if not logged in', function (done) {
            chai.request(app_1.app)
                .post('/api/polls')
                .send(newPollData)
                .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
        });
        it('should create new poll when logged in', function (done) {
            var cookie;
            var server = chai.request(app_1.app);
            server
                .post('/api/login')
                .send({
                email: userCredentials.email,
                password: userCredentials.password
            })
                .end(function (err, res) {
                res.should.have.status(200);
                cookie = res.headers['set-cookie'];
                server
                    .post('/api/polls')
                    .set('cookie', cookie)
                    .send(newPollData)
                    .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
            });
        });
    });
    describe('route /api/polls/:id', function () {
        it('should be able to get one poll', function (done) {
            chai.request(app_1.app)
                .get("/api/polls/" + poll._id)
                .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.an('object');
                should.equal(res.body.name, poll.name);
                done();
            });
        });
    });
    describe('route /api/polls/:id', function () {
        it('should not be able to delete a poll if not logged in', function (done) {
            chai.request(app_1.app)
                .delete("/api/polls/" + poll._id)
                .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
        });
        it('should not be able to delete a poll created by another user', function (done) {
            var server = chai.request(app_1.app);
            var newUserCredentials = {
                name: 'New user',
                email: 'new@example.com',
                password: '123456789'
            };
            var user = new user_model_1.default(newUserCredentials);
            user.hashPassword(newUserCredentials.password);
            var cookie;
            user.save(function () {
                server
                    .post('/api/login')
                    .send({
                    email: newUserCredentials.email,
                    password: newUserCredentials.password
                })
                    .end(function (err, res) {
                    res.should.have.status(200);
                    cookie = res.headers['set-cookie'];
                    server
                        .delete("/api/polls/" + poll._id)
                        .set('cookie', cookie)
                        .end(function (err, res) {
                        res.should.have.status(403);
                        done();
                    });
                });
            });
        });
        it('should be able to delete a poll successfully', function (done) {
            var server = chai.request(app_1.app);
            var cookie;
            server
                .post('/api/login')
                .send({
                email: userCredentials.email,
                password: userCredentials.password
            })
                .end(function (err, res) {
                res.should.have.status(200);
                cookie = res.headers['set-cookie'];
                server
                    .delete("/api/polls/" + poll._id)
                    .set('cookie', cookie)
                    .end(function (err, res) {
                    res.should.have.status(200);
                    poll_model_1.default.find({}, function (err, polls) {
                        polls.should.be.an('array');
                        polls.should.have.lengthOf(0);
                        done();
                    });
                });
            });
        });
    });
    describe('route /api/polls/vote/:id', function () {
        it('should vote successfully for the existing option', function (done) {
            var pollId = poll._id;
            var optionId = poll.options[0]._id;
            chai.request(app_1.app)
                .post("/api/polls/vote/" + pollId)
                .send({ id: optionId })
                .end(function (err, res) {
                res.should.have.status(200);
                poll_model_1.default.findById(pollId, function (err, updatedPole) {
                    should.equal(updatedPole.options[0].votes, 1);
                    done();
                });
            });
        });
        it('should not be able to create a new option if not logged in', function (done) {
            chai.request(app_1.app)
                .post("/api/polls/vote/" + poll._id)
                .send({ value: 'option 3' })
                .end(function (err, res) {
                res.should.have.status(403);
                done();
            });
        });
        it('should be able to create a new option if logged in', function (done) {
            var server = chai.request(app_1.app);
            var cookie;
            var newValue = 'option 3';
            server
                .post('/api/login')
                .send({
                email: userCredentials.email,
                password: userCredentials.password
            })
                .end(function (err, res) {
                res.should.have.status(200);
                cookie = res.headers['set-cookie'];
                server
                    .post("/api/polls/vote/" + poll._id)
                    .send({ value: newValue })
                    .set('cookie', cookie)
                    .end(function (err, res) {
                    res.should.have.status(200);
                    poll_model_1.default.findById(poll._id, function (err, updatedPoll) {
                        updatedPoll.options.should.have.lengthOf(3);
                        should.equal(updatedPoll.options[2].value, newValue);
                        should.equal(updatedPoll.options[2].votes, 1);
                        done();
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=poll.controller.test.js.map
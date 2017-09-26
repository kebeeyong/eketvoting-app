"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var chaiHttp = require("chai-http");
var should = chai.use(chaiHttp).should();
var app_1 = require("../../app");
var user_model_1 = require("../../models/user.model");
describe('User controller', function () {
    var validUserCredentials = {
        name: 'name',
        email: 'example@example.com',
        password: '123456789'
    };
    var user;
    beforeEach(function (done) {
        user = new user_model_1.default({ name: validUserCredentials.name, email: validUserCredentials.email });
        user.hashPassword(validUserCredentials.password);
        user.save(done);
    });
    afterEach(function (done) {
        user_model_1.default.remove({}, done);
    });
    describe('should test route /api/login', function () {
        it('should not login user if no email provided', function (done) {
            chai.request(app_1.app)
                .post('/api/login')
                .send({ password: validUserCredentials.password })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'Email is required');
                done();
            });
        });
        it('should not login user if no password provided', function (done) {
            chai.request(app_1.app)
                .post('/api/login')
                .send({ email: 'example@example.com' })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'Password is required');
                done();
            });
        });
        it('should login valid user', function (done) {
            chai.request(app_1.app)
                .post('/api/login')
                .send({ email: validUserCredentials.email, password: validUserCredentials.password })
                .end(function (err, res) {
                res.should.have.status(200);
                should.equal(res.body._id, user._id.toString());
                should.equal(res.body.name, user.name);
                should.equal(res.body.email, user.email);
                done();
            });
        });
        it('should not login user with invalid email', function (done) {
            chai.request(app_1.app)
                .post('/api/login')
                .send({ email: 'invalid@example.com', password: validUserCredentials.password })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'User doesn\'t exist');
                done();
            });
        });
        it('should not login user with invalid password', function (done) {
            chai.request(app_1.app)
                .post('/api/login')
                .send({ email: validUserCredentials.email, password: 'invalid_password' })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'Password is incorrect');
                done();
            });
        });
    });
    describe('should test route /api/register', function () {
        it('should not register user if no name provided', function (done) {
            chai.request(app_1.app)
                .post('/api/register')
                .send({ email: validUserCredentials.email, password: validUserCredentials.password })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'Name is required');
                done();
            });
        });
        it('should not register user if no email provided', function (done) {
            chai.request(app_1.app)
                .post('/api/register')
                .send({ name: validUserCredentials.name, password: validUserCredentials.password })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'Email is required');
                done();
            });
        });
        it('should not register user if no password provided', function (done) {
            chai.request(app_1.app)
                .post('/api/register')
                .send({ name: validUserCredentials.name, email: validUserCredentials.email })
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'Password is required');
                done();
            });
        });
        it('should not register user if it already exists', function (done) {
            chai.request(app_1.app)
                .post('/api/register')
                .send(validUserCredentials)
                .end(function (err, res) {
                res.should.have.status(400);
                should.equal(res.body.message, 'User with this email already exists');
                done();
            });
        });
        it('should register new user successfully', function (done) {
            var newUserCredentials = {
                name: 'User2',
                email: 'new@example.com',
                password: '123456789'
            };
            chai.request(app_1.app)
                .post('/api/register')
                .send(newUserCredentials)
                .end(function (err, res) {
                res.should.have.status(200);
                should.exist(res.body._id);
                should.equal(res.body.name, newUserCredentials.name);
                should.equal(res.body.email, newUserCredentials.email);
                done();
            });
        });
    });
    describe('should test route /api/logout', function () {
        it('should logout user', function (done) {
            chai.request(app_1.app)
                .get('/api/logout')
                .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
        });
    });
});
//# sourceMappingURL=user.controller.test.js.map
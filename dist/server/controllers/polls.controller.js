"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var poll_model_1 = require("../models/poll.model");
var PollsController = (function () {
    function PollsController() {
        this.create = function (req, res) {
            var poll = new poll_model_1.default(req.body);
            poll.createdBy = req.user;
            poll.save(function (err) {
                if (err)
                    return res.status(500).send(err);
                res.send(poll);
            });
        };
        this.canVote = function (req, res, next) {
            var _a = req.body, id = _a.id, value = _a.value;
            if (value && !req.isAuthenticated()) {
                return res.status(403).send({ message: 'User is not authorized' });
            }
            // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var ip = req.headers['x-forwarded-for'];
            var userVoted;
            var ipVoted;
            userVoted = req.user && req.poll.users.some(function (user) {
                return user.equals(req.user.id);
            });
            ipVoted = req.poll.ips.indexOf(ip) !== -1;
            /*  if (userVoted || ipVoted) {  */
            if (userVoted) {
                return res.status(403).send({ message: 'You already voted' });
            }
            return next();
        };
        this.canDelete = function (req, res, next) {
            if (!req.poll.createdBy.equals(req.user._id)) {
                return res.status(403).send({ message: 'User is not authorized' });
            }
            return next();
        };
        this.get = function (req, res) {
            res.send(req.poll);
        };
        this.delete = function (req, res) {
            req.poll.remove(function (err) {
                if (err)
                    return res.status(500).send(err);
                return res.send({});
            });
        };
        this.list = function (req, res) {
            poll_model_1.default.find({}).limit(parseInt(req.query.limit || 100)).populate('createdBy', 'name').exec(function (err, polls) {
                if (err)
                    return res.status(500).send(err);
                res.send(polls);
            });
        };
        this.vote = function (req, res) {
            var _a = req.body, id = _a.id, value = _a.value, poll = req.poll;
            if (id) {
                var optionToVote = poll.options.id(id);
                optionToVote.votes++;
            }
            else {
                poll.options.push({ value: value, votes: 1 });
            }
            if (req.user) {
                poll.users.push(req.user._id);
            }
            //  poll.ips.push(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
            poll.ips.push(req.headers['x-forwarded-for']);
            poll.save(function (err) {
                if (err)
                    return res.status(500).send(err);
                return res.send(poll);
            });
        };
    }
    PollsController.prototype.getPoll = function (req, res, next) {
        poll_model_1.default.findById(req.params.id).exec(function (err, poll) {
            if (err)
                return res.status(500).send(err);
            if (!poll)
                return res.status(500).send({ message: 'Poll doesn\'t exist' });
            req.poll = poll;
            return next();
        });
    };
    return PollsController;
}());
exports.default = PollsController;
//# sourceMappingURL=polls.controller.js.map
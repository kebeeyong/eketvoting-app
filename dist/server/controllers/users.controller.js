"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var validator = require("validator");
var user_model_1 = require("../models/user.model");
var UsersController = (function () {
    function UsersController() {
        this.login = function (req, res, next) {
            var _a = req.body, email = _a.email, password = _a.password;
            if (!email)
                return res.status(400).send({ message: 'Email is required' });
            if (!password)
                return res.status(400).send({ message: 'Password is required' });
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!user) {
                    return res.status(400).send(info);
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.send({ _id: user._id, name: user.name, email: user.email });
                });
            })(req, res, next);
        };
        this.register = function (req, res) {
            var _a = req.body, name = _a.name, email = _a.email, password = _a.password;
            if (!name)
                return res.status(400).send({ message: 'Name is required' });
            if (!email)
                return res.status(400).send({ message: 'Email is required' });
            if (!password)
                return res.status(400).send({ message: 'Password is required' });
            if (!validator.isEmail(email))
                return res.status(400).send({ message: 'Email is invalid' });
            if (password.length < 6)
                return res.status(400).send({ message: 'Password should be at least 6 digits long' });
            var newUser = new user_model_1.default({ name: name, email: email });
            newUser.hashPassword(password);
            user_model_1.default.findOne({ email: email }, function (err, user) {
                if (err)
                    return res.status(500).send(err);
                if (user) {
                    return res.status(400).send({ message: 'User with this email already exists' });
                }
                newUser.save(function (err) {
                    if (err)
                        return res.status(500).send(err);
                    req.logIn(newUser, function (err) {
                        if (err)
                            return res.status(500).send(err);
                        return res.send({ _id: newUser._id, name: newUser.name, email: newUser.email });
                    });
                });
            });
        };
        this.logout = function (req, res) {
            req.logout();
            return res.send({ message: 'User is logged out' });
        };
        this.changePassword = function (req, res) {
            var userId = req.body.userId;
            var _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
            if (!oldPassword)
                return res.status(400).send({ message: 'Old password is required' });
            if (!newPassword)
                return res.status(400).send({ message: 'New password is required' });
            if (newPassword.length < 6)
                return res.status(400).send({ message: 'New password should be at least 6 digits long' });
            user_model_1.default.findById(userId, function (err, user) {
                if (err)
                    return res.status(500).send({ message: err.message });
                if (!user.validPassword(oldPassword)) {
                    return res.status(400).send({ message: 'Old password is incorrect' });
                }
                user.hashPassword();
                user.save(function (err) {
                    if (err)
                        return res.status(500).send({ message: err.message });
                    return res.send({ message: 'Password changed successfully' });
                });
            });
        };
        this.isAuthenticated = function (req, res, next) {
            if (!req.isAuthenticated()) {
                return res.status(401).send({ message: 'User is not logged in' });
            }
            next();
        };
    }
    return UsersController;
}());
exports.default = UsersController;
//# sourceMappingURL=users.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var polls_controller_1 = require("./controllers/polls.controller");
var users_controller_1 = require("./controllers/users.controller");
function setRoutes(app) {
    var pollsController = new polls_controller_1.default();
    var usersController = new users_controller_1.default();
    // auth
    app.post('/api/login', usersController.login);
    app.post('/api/register', usersController.register);
    app.get('/api/logout', usersController.logout);
    app.post('/api/change-password', usersController.isAuthenticated, usersController.changePassword);
    // polls
    app.route('/api/polls')
        .get(pollsController.list)
        .post(usersController.isAuthenticated, pollsController.create);
    app.route('/api/polls/:id')
        .get(pollsController.getPoll, pollsController.get)
        .delete(usersController.isAuthenticated, pollsController.getPoll, pollsController.canDelete, pollsController.delete);
    app.route('/api/polls/vote/:id/')
        .post(pollsController.getPoll, pollsController.canVote, pollsController.vote);
}
exports.default = setRoutes;
//# sourceMappingURL=routes.js.map
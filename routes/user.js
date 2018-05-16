const express = require('express');
const UserController = require('../controllers/user');


var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' })

api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.get('/users', UserController.getUsers);
api.get('/user/:id', [md_auth.ensureAuth], UserController.getUser);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/image/:id', [md_auth.ensureAuth], UserController.UploadImage);
api.get('/image/:image', UserController.getImageFile);

module.exports = api;
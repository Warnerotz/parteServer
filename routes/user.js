const express = require('express');
const UserController = require('../controllers/user');


var api = express.Router();

var md_auth = require('../middlewares/authenticated');


api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.get('/users', [md_auth.ensureAuth], UserController.getUsers);
api.get('/user/:id', [md_auth.ensureAuth], UserController.getUser);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/image/:id', [md_auth.ensureAuth], UserController.UploadImage);
api.get('/image/:image', UserController.getImageFile);
api.delete('/user/:id', [md_auth.ensureAuth], UserController.deleteUser);

module.exports = api;
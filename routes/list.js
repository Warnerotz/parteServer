const express = require('express');
const ListController = require('../controllers/list');

var api = express.Router();

var multipart = require('connect-multiparty');

var md_uplolad = multipart({ uploadDir: './uploads/medias' });

api.post('/list', ListController.saveList);
api.get('/lists', ListController.getLists);
api.post('/list/media/:id', md_uplolad, ListController.uploadMedia);
module.exports = api;
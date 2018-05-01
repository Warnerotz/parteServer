const express = require('express');
const ListController = require('../controllers/list');
var api = express.Router();

api.get('/lists', ListController.getLists);
api.get('/list/:id', ListController.getList);
api.get('/list/media/:mediaFile', ListController.getMediaFile);
api.post('/list', ListController.saveList);
api.post('/list/media/:id', ListController.uploadMedia);
module.exports = api;
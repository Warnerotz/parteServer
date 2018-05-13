const express = require('express');
const ListController = require('../controllers/list');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');


api.get('/lists', [md_auth.ensureAuth], ListController.getLists);
api.get('/list/:id', [md_auth.ensureAuth], ListController.getList);
api.delete('/list/:id', [md_auth.ensureAuth], ListController.deleteList);
api.get('/list/media/:mediaFile', ListController.getMediaFile);
api.post('/list', [md_auth.ensureAuth], ListController.saveList);
api.post('/list/media/:id', [md_auth.ensureAuth], ListController.uploadMedia);
module.exports = api;
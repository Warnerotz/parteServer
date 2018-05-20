const express = require('express');
const ListController = require('../controllers/list');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/medias/images' });


api.get('/lists', [md_auth.ensureAuth], ListController.getLists);
api.get('/list/:id', [md_auth.ensureAuth], ListController.getList);
api.delete('/list/:id', [md_auth.ensureAuth], ListController.deleteList);
api.get('/list/media/:mediaFile', ListController.getMediaFile);
api.put('/list/:id', md_auth.ensureAuth, ListController.updateList);
api.post('/list/image/:id', [md_auth.ensureAuth], ListController.UploadImage);
api.post('/list', [md_auth.ensureAuth, md_upload], ListController.saveList);
api.post('/list/media/:id', [md_auth.ensureAuth], ListController.uploadMedia);
api.put('/list/media/delete', [md_auth.ensureAuth], ListController.deleteMedia);
api.get('/listImage/:image', ListController.getListImageFile);
module.exports = api;
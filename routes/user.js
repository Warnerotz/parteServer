const express = require('express');
const ListController = require('../controllers/list');

var api = express.Router();

api.get('/pruebas-del-controlador', ListController.pruebas);
module.exports = api;
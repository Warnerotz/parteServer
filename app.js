var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var list_routes = require('./routes/list');
//var user_routes = require('./routes/user');

//middlewares de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Acces-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();

});

//rutas base
app.use('/api', list_routes);
//app.user('/api', user_routes);

module.exports = app;
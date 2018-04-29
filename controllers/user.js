//modulos
const bcrypt = require('bcrypt-nodejs');

//modelos

function pruebas(req, res) {
    res.send({
        message: "probando el controlador afasdasddasd"

    });

};

function register(req, res) {
    res.status(200).send({
        message: "registerr!!!!!!!!!!!!"

    });

}

module.exports = {
    pruebas,
    saveList
}
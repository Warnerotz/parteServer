//modulos
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');

var User = require('../models/user');


//servicio jwt
var jwt = require('../services/jwt');

//acciones
function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    console.log(req.body);
    if (params.password && params.name && params.email && params.age) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.validated = false;
        user.age = params.age;
        user.image = null;


        User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({ message: "error al comprobar si existe usuario" });
            } else {
                if (!issetUser) {
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;

                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: "error al guardar el usuario" });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: "No se ha registrado el usuario" });

                                } else {
                                    res.status(200).send({ user: userStored });

                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({ message: "El email ya esta siendo utilizado" });

                }
            }
        });
    } else {
        res.status(200).send({ message: "Introduce los datos correctamente" });

    }
}

function login(req, res) {
    var params = req.body;
    console.log(params);
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "error al comprobar si existe usuario" });
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        //comprobar y general el token
                        if (params.gettoken) {
                            res.status(200).cookie('auth', jwt.createToken(user)).send({ token: jwt.createToken(user) })
                        } else {
                            user.password = '';
                            res.status(200).cookie('auth', jwt.createToken(user)).send({ user });

                        }


                    } else {
                        res.status(404).send({ message: 'usuario o password incorrectos' });
                    }
                })
            } else {
                res.status(404).send({ message: 'usuario o password incorrectos' });

            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: "No tienes permiso para actualizar el usuario" })
    }

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: "error al actualizar el usuario" })

        } else {
            if (!userUpdated) {
                res.status(404).send({ message: "no se ha podido actualizar el usuario" })

            } else {
                res.status(200).send({ user: userUpdated });

            }

        }

    });

}

function UploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'no subido';

    if (req.files) {

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];



        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            if (userId != req.user.sub) {
                return res.status(500).send({ message: "No tienes permiso para actualizar el usuario" })
            }

            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: "error al actualizar el usuario" })

                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: "no se ha podido actualizar el usuario" })

                    } else {
                        res.status(200).send({ user: userUpdated, image: file_name });

                    }

                }

            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({ message: 'extension no valida y fichero no borrado' });
                } else {
                    res.status(200).send({ message: 'extension no valida' });
                }
            });
        }
    } else {
        res.status(200).send({ message: 'No se ha subido archivo' });
    }
}


function getImageFile(req, res) {
    var imageFile = req.params.image;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'la imagen no existe' });

        }

    });

}

function getUsers(req, res) {
    User.find({}).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" })
        } else {
            if (!users) {
                res.status(404).send({ message: "no hay usuarios" })

            } else {
                res.status(200).send({
                    users
                })
            }
        }
    })

}

module.exports = {
    saveUser,
    login,
    updateUser,
    UploadImage,
    getImageFile,
    getUsers

}
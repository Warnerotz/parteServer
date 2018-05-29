//modulos
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path');
var multer = require('multer');

var User = require('../models/user');


//servicio jwt
var jwt = require('../services/jwt');

//acciones
function saveUser(req, res) {
    var user = new User();

    var params = req.body;

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
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "error al comprobar si existe usuario" });
        } else {
            if (user) {
                if (user.validated) {
                    bcrypt.compare(password, user.password, (err, check) => {
                        if (check) {
                            //comprobar y general el token
                            if (params.gettoken) {
                                res.status(200).cookie('auth', jwt.createToken(user)).send({ token: jwt.createToken(user) })
                            } else {
                                delete user.password;
                                res.status(200).cookie('auth', jwt.createToken(user)).send({ user });
                            }
                        } else {
                            res.status(404).send({ message: 'usuario o password incorrectos' });
                        }
                    })
                } else {
                    res.status(404).send({ message: 'usuario no validado espere ha ser validado para loguear' });
                }
            } else {
                res.status(404).send({ message: 'usuario o password incorrectos' });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;


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

function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" })
        } else {
            if (!user) {
                res.status(404).send({ message: "no existe lista" })

            } else {
                res.status(200).send({
                    user
                })
            }
        }

    })

}



function UploadImage(req, res) {
    var userId = req.params.id;



    var store = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/users');

        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }

    });
    var upload = multer({ storage: store }).single('image');

    upload(req, res, function(err) {
        if (err) {
            return res.status(500).send({ error: err });
        }
        if (req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpg' || req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/gif') {
            if (userId != req.user.sub) {
                return res.status(500).send({ message: "No tienes permiso para actualizar el usuario" })
            }
            User.findByIdAndUpdate(userId, { image: req.file.originalname }, { new: true }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: "error al actualizar el usuario" })
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: "no se ha podido actualizar el usuario" })
                    } else {
                        res.status(200).send({ user: userUpdated, image: req.file.name });

                    }
                }
            });
        } else {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    res.status(200).send({ message: 'extension no valida y fichero no borrado' });
                } else {
                    res.status(200).send({ message: 'extension no valida' });
                }
            });
        }

    })
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

function deleteUser(req, res) {
    var userId = req.params.id;
    User.findByIdAndRemove(userId, (err, userRemoved) => {
        if (err) {
            res.status(200).send({ message: 'error en la peticion' });

        } else {
            if (!userRemoved) {
                res.status(404).send({ message: 'no se ha borrado la lista' });

            } else {
                res.status(200).send({ user: userRemoved });
            }
        }

    });

}

module.exports = {
    saveUser,
    login,
    updateUser,
    UploadImage,
    getImageFile,
    getUsers,
    getUser,
    deleteUser

}
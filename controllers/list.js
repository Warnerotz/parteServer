//modulos
var fs = require('fs');
var multer = require('multer');
var path = require('path');


//modelos
const List = require('../models/list');



//acciones
function saveList(req, res) {
    //crear objeto lista
    let list = new List();
    //recoger los parametros de la peticion
    let params = req.body;
    //Asignar valores al objeto lista
    list.name = params.name;
    list.description = params.description;
    list.img = null;
    list.user = req.user.sub;
    list.save((err, listStored) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" })
        } else {
            if (!listStored) {
                res.status(404).send({ message: "la lista no se ha podido guardar" })
            } else {
                res.status(200).send({
                    list: listStored
                })
            }
        }
    });

};

function getLists(req, res) {
    userId = req.params.userId;
    List.find({ 'user': userId }).populate({ path: 'user' }).exec((err, lists) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" })
        } else {
            if (!lists) {
                res.status(404).send({ message: "no hay listas" })

            } else {
                res.status(200).send({
                    lists
                })
            }
        }
    })
};

function UploadImage(req, res) {

    const listId = req.params.id;
    //config multer

    var store = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/medias/images');
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
            List.findByIdAndUpdate(listId, { img: req.file.originalname }, { new: true }, (err, listUpdated) => {
                if (err) {
                    res.status(500).send({ message: "error al actualizar la lista" })
                } else {
                    if (!listUpdated) {
                        res.status(404).send({ message: "no se ha podido actualizar la lista" })
                    } else {
                        res.status(200).send({ list: listUpdated, image: req.file.name });
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

function getListImageFile(req, res) {
    var imageFile = req.params.image;
    var path_file = './uploads/medias/images/' + imageFile;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'la imagen no existe' });
        }
    });
}

function getList(req, res) {
    let listId = req.params.id;
    List.findById(listId).populate({ path: 'user' }).exec((err, list) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" })
        } else {
            if (!list) {
                res.status(404).send({ message: "no existe lista" })

            } else {
                res.status(200).send({
                    list
                })
            }
        }

    })

}

function uploadMedia(req, res, next) {
    var listId = req.params.id;

    //config multer

    var store = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/medias');

        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }

    });
    var upload = multer({ storage: store }).single('file');

    upload(req, res, function(err) {
        if (err) {
            return res.status(500).send({ error: err });

        }
        List.findByIdAndUpdate(listId, {
                $push: { media: { name: req.file.originalname, path: req.file.path, size: req.file.size, fellow: req.file.mimetype } }
            }, { new: true },
            (err, lisUpdate) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar la lista'
                    });
                } else {
                    if (!lisUpdate) {
                        res.status(404).send({ message: "no se ha podido actualizar la lista" });
                    } else {
                        res.status(200).send({ list: lisUpdate, file: req.file, originalname: req.file.originalname, uploadname: req.file.filename });

                    }

                }
            })

    })
}

function deleteMedia(req, res) {
    // {"_id": id},{awards: {$elemMatch: {award:'Turing Award', year:1977}}}
    var listId = req.body.listId;
    var mediaId = req.body.mediaId;
    List.findByIdAndUpdate(listId, { $pull: { media: { _id: mediaId } } }, { new: true }, (err, listUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar la lista'
            });
        } else {
            if (!listUpdated) {
                res.status(404).send({ message: "no se ha podido actualizar la lista" });
            } else {
                res.status(200).send({ list: listUpdated });

            }

        }
    })

    List.findById(listId, (err, lista) => {
        const mediaToRemove = lista.media.filter((media) => media._id == mediaId);
        fs.unlink(mediaToRemove[0].path);
    });



}

function getMediaFile(req, res) {
    const mediaFile = req.params.mediaFile;
    var path_file = './uploads/medias/' + mediaFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));

        } else {
            res.status(404).send({ message: 'no existe el video' })

        }

    })

}

function deleteList(req, res) {
    var listId = req.params.id;
    List.findByIdAndRemove(listId, (err, listRemoved) => {
        if (err) {
            res.status(200).send({ message: 'error en la peticion' });

        } else {
            if (!listRemoved) {
                res.status(404).send({ message: 'no se ha borrado la lista' });

            } else {
                res.status(200).send({ list: listRemoved });
            }
        }

    });

}

function updateList(req, res) {
    var listId = req.params.id;
    var update = req.body;

    List.findByIdAndUpdate(listId, update, { new: true }, (err, listUpdated) => {
        if (err) {
            res.status(500).send({ message: "error al actualizar el usuario" })

        } else {
            if (!listUpdated) {
                res.status(404).send({ message: "no se ha podido actualizar el usuario" })

            } else {
                res.status(200).send({ list: listUpdated });

            }

        }

    });

}

module.exports = {
    saveList,
    getLists,
    getList,
    uploadMedia,
    getMediaFile,
    deleteList,
    UploadImage,
    deleteMedia,
    updateList,
    getListImageFile
}
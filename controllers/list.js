//modulos
var fs = require('fs');
var multer = require('multer');
var path = require('path');


//modelos
const List = require('../models/list');

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

//acciones
function saveList(req, res) {
    console.log(req.files);
    //crear objeto lista
    let list = new List();
    //recoger los parametros de la peticion
    let params = req.body;
    //Asignar valores al objeto lista
    list.name = params.name;
    list.user = req.user.sub;
    if (req.files) {
        console.log('holaaa');

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            list.img = file_name;
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
        console.log('porquee entro en el else');
        res.status(200).send({ message: 'No se ha subido archivo' });
    }

};

function getLists(req, res) {
    List.find({}).populate({ path: 'user' }).exec((err, lists) => {
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

function getMediaFile(req, res) {
    const mediaFile = req.params.mediaFile;
    var path_file = './uploads/medias/' + mediaFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            console.log("entro en exist!!")
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

module.exports = {
    saveList,
    getLists,
    getList,
    uploadMedia,
    getMediaFile,
    deleteList
}
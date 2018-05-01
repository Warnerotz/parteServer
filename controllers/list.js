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
    //crear objeto lista
    let list = new List();
    //recoger los parametros de la peticion
    let params = req.body;
    console.log(params);
    //Asignar valores al objeto lista
    list.name = params.name;
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
    List.find({}).exec((err, lists) => {
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
    List.findById(listId).exec((err, list) => {
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
        console.log(req.file);
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
    console.log("entrooo get media")
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

module.exports = {
    saveList,
    getLists,
    getList,
    uploadMedia,
    getMediaFile
}
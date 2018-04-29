//modulos


//modelos
const List = require('../models/list');

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

function listOne(req, res) {


}

function uploadMedia(req, res) {
    var listId = req.params.id;
    var file_name = 'no subido...';
    if (req.files) {
        var filePath = req.files.media.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if (fileExt == 'mp4') {
            List.findByIdAndUpdate(listId, { $push: { media: { name: 'miko', path: fileName } } }, { new: true }, (err, lisUpdate) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar la lista'
                    });
                } else {
                    if (!lisUpdate) {
                        res.status(404).send({ message: "no se ha podido actualizar la lista" });
                    } else {
                        res.status(200).send({ list: lisUpdate, image: fileName });

                    }

                }
            })

        } else {
            res.status(200).send({ message: "extension no valida" })

        }



    } else {
        res.status(404).send({ message: "no hay ficheros" })
    }

}



module.exports = {
    saveList,
    getLists,
    listOne,
    uploadMedia
}
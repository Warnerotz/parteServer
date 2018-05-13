var jwt = require('jwt-simple');
var moment = require('moment');
var SECRET = 'clave_secreta_para_el_proyecto'

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de auth' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, SECRET);

        if ((payload.exp <= moment().unix())) {
            return res.status(401).send({ message: 'el token ha expirado' })

        }
    } catch (err) {
        return res.status(404).send({ message: 'el token no es valido' })

    }


    req.user = payload;

    next();
}
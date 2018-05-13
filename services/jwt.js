var jwt = require('jwt-simple');
var moment = require('moment');
var SECRET = 'clave_secreta_para_el_proyecto'
exports.createToken = function(user) {
    //objeto para codificar el token
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, SECRET);
};
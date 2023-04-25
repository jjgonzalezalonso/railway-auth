const { response } = require('express');
const jwt = require('jsonwebtoken'); //lo he escrito

const validarJWT = ( req, res = response, next ) => {
    const token = req.header('x-token');
    if( !token  ) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }

    try {
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        //para verificar si el token ha sido firmado con la llave .env.SECRET_JWT_SEED
        //console.log (uid,name);
        req.uid  = uid;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    // TODO OK!
    next();
}

module.exports = {
    validarJWT
}


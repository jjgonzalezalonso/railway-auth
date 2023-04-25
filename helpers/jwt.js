const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {
    //recibo el uid y el name del usuario
    const payload = { uid, name };
    return new Promise( (resolve, reject) => {
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (err, token) => {
            if ( err ) {
                // TODO MAL
                console.log(err);
                reject(err);
    
            } else {
                // TODO BIEN
                resolve( token )
            }   
        })
    });
}

module.exports = {
    generarJWT
}

//al ser una promesa
// generarJWT().then
// generarJWT().catch  // si lo hace mal
// generarJWT().finally // si lo hace bien o mal
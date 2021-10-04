const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '') => {

    return new Promise( ( resolve, reject)  => {

        const payload = { uid };
        const key = process.env.PRIVATE_KEY;

        jwt.sign( payload, key, {
            expiresIn: '1h'
        }, (err, token) => {

            if (err){
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve( token );
            }

        })

    });

}

module.exports = {
    generarJWT
}
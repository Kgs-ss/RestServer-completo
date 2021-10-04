const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const key = process.env.PRIVATE_KEY;

const validarJWT = async(req, res = response, next) => {

    const token = req.header('x-token');

    if ( !token ){
       return res.status(401).json({
           msg: 'token invalido'
       });
    }

    try{
        const { uid } = jwt.verify(token, key);

        // leer el usuario correspondiente al id activo
        const usuario = await Usuario.findById(  uid  );

        if ( !usuario ){
            return res.status(401).json({
                msg: 'token no valido false'
            });
        }

        //verificar id activado
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'token no valido false'
            });
        }

        req.usuario = usuario;
        next();
        
    }catch(error){

        console.log(error);
        res.status(401).json({
            msg: 'token Invalido'
        });
    }

    

    
}

module.exports = {
    validarJWT
}
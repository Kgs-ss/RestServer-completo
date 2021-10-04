const { request, response, json } = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');



const login = async(req = request, res = response) => {
    
    const { correo, pass } = req.body;

    try{

        //verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrecto/s'
            })
        }

        //verificar si estado true
        if ( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrecto/s'
            })
        }

        //verificar el pass
        const validPass = bcrypt.compareSync( pass, usuario.pass);

        if (!validPass){
            return res.status(400).json({
                msg: 'Usuario / contraseña incorrecto/s '
            })
        }

        //generar el JWT
        const token = await generarJWT( usuario.id );

        res.json ({
            usuario,
            token
        })

    } catch ( error ){
        
        console.log(error);

        res.status(500).json({       
            msg: 'Hable con el admin'
        });
    }
}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try{

        
        const { nombre, img, correo } = await googleVerify( id_token );
      
        let usuario = await Usuario.findOne({ correo });
       
        //se crea
        if ( !usuario ){
            
            const data = {
                nombre,
                correo,
                pass: 'tta',
                img,
                google: true,
                rol: 'USER_ROLE'
            
            };
            
            usuario = new Usuario( data );
            await usuario.save();
        }

        //si esta desactivado
        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Genero JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error){

        res.status(400).json({
            msg: 'El token no se pudo verificar'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}
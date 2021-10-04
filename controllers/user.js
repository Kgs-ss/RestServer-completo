//desestruturamos Response de express para mantener las ayudas, tambien podriamos hacerlo con la request
const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true};
 
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(Number( desde ))
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
  }

const usuariosPut = async(req = request , res = response) => {

    const query = {estado: true};
    const { id } = req.params;
    const { _id, estado, pass, google, correo, ...resto} = req.body;


    if ( pass ) {
        const salt = bcrypt.genSaltSync();
        resto.pass = bcrypt.hashSync(pass, salt);
    }

    const  usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(400).json({
           usuario
    })
   }

const usuariosPost = async(req = request , res = response) => {

    const { nombre, correo, pass, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, pass, rol} );

    //creamos el hash del pass
    const salt = bcrypt.genSaltSync();
    usuario.pass = bcrypt.hashSync(pass, salt);

    //guardamos la info
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosDelete = async(req = request , res = response) => {

    const { id } = req.params;

    const uid = req.uid;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    //usuariosPatch
    
}
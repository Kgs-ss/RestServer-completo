const { response } = require("express");

const { ObjectId } = require('mongoose').Types;

// const { existeUsuarioPorId } = require("../helpers/db-validators");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ){

        const usuario = await Usuario.findById( termino );
        return res.json({ 
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({ 
        $or: [{nombre: regex }, { correo: regex}],
        $and: [{estado: true}]
    });

    const total = await Usuario.count({ 
        $or: [{nombre: regex }, { correo: regex}],
        $and: [{estado: true}]
    });
    res.json({ 
        total,
        results: usuarios
    });
}

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ){

        const categoria = await Categoria.findById( termino );
        return res.json({ 
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({nombre: regex , estado: true});

    const total = await Categoria.count({nombre: regex , estado: true});
 
    res.json({ 
        total,
        results: categorias
    });
}

const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ){

        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
        return res.json({ 
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({nombre: regex , estado: true}).populate('categoria', 'nombre');;

    const total = await Producto.count({nombre: regex , estado: true});
 
    res.json({ 
        total,
        results: productos
    });
}

//TO DO busqueda de todos los productos de una misma categoria

const buscar = ( req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)){

        return res.status(400).json({
            msg: `las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion){
        case 'categorias':
                buscarCategorias(termino, res);
            break;
        case 'productos':
                buscarProductos(termino, res);
            break;
        case 'usuarios':
                buscarUsuarios(termino, res);
            break;
        default:
            res.status(400).json({
                msg: 'no permitido'
            })
    }

} 


module.exports = {

    buscar

}

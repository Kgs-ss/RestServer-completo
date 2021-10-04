const { response } = require("express");

const { Categoria } = require("../models");

const obtenerCategorias = async(req, res = response) => {

   const { limite = 3, desde = 0 } = req.query;

   const estado = { estado: true };

   const [ total, categorias ] = await Promise.all([
       Categoria.countDocuments(estado),
       Categoria.find( estado )
        .populate('usuario', 'nombre')
        .skip(Number( desde ))
        .limit(Number( limite ))
   ]);

   res.json({
       total,
       categorias
   });
}


//OBTENER CATEGORIA ID - POPULATE {}

const obtenerCategoriaId = async( req, res = response ) => {
    
    const { id } = req.params;
    
    try{
        const idCategoria = await Categoria.findById( id  ).populate('usuario', 'nombre');
        res.json({
            idCategoria
        });
    } catch (error){
        res.status(400).json({
            msg: 'Algo fallo'
        });
    }
}

//Crear Categoria
const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if ( categoriaDB ){
        return res.status(400).json({
            msg: 'La categoria ya exisite'
        });
    }

    try{
        //Generar data
        const data = {
            nombre,
            usuario: req.usuario._id
        }

        //creamos la categoria
        const categoria = new Categoria( data );

        //guardamos en db
        await categoria.save();

        res.status(201).json(categoria);

    } catch (error){

        res.status(400).json({
            msg: 'Algo fue mal categoria'
        });

    }
}

//ACTUALIZAR CATEGORIA

const actualizarCategoria = async(req, res = response) => {
    
    const { id } = req.params;
    
    const { _id, usuario, estado, ...data } = req.body;

    const nombre = req.body.nombre.toUpperCase();

    //TO DO Middleware estado & nombre
    //Compruebo cat estado

    let estadoCategoria = await Categoria.findById(id );

    if ( !estadoCategoria.estado ){
        return res.status(401).json({
            msg: 'Hable con el administrador, categoria inexistente'
        });
    } 

    //Compruebo cat nombre

    const categoriaDB = await Categoria.findOne({nombre});

    if ( categoriaDB ){
        return res.status(400).json({
            msg: 'La categoria ya exisite'
        });
    }

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true } );

    res.status(201).json({
        categoria
    });
}

//BORRAR CATEGORIA ESTADO: FALSE - SOLO ADMIN

const borrarCategoria = async(req, res = response) => {

    const { id , estado } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false } , { new: true });

    res.json({
        msg: 'Categoria borrado',
        categoria
    });
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria
}
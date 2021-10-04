const { response } = require("express");

const { Producto, Categoria } = require("../models");

//obtener lista con todos los productos

const obtenerProductos = async(req, res = response) => {

    const { limite = 3, desde = 0 } = req.query;
 
    const estado = { estado: true };
 
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(estado),
        Producto.find( estado )
         .populate('categoria', 'nombre')
         .populate('usuario', 'nombre')
         .skip(Number( desde ))
         .limit(Number( limite ))
    ]);
 
    res.json({
        total,
        productos
    });
}
//obtener producto por id

const obtenerProductoId = async( req, res = response ) => {
    
    const { id } = req.params;
    
    try{
        const producto = await Producto.findById( id ).populate('usuario', 'nombre').populate('categoria', 'nombre');
        res.json({
            producto
        });
    } catch (error){
        res.status(400).json({
            msg: 'Algo fallo al obtener el producto'
        });
    }
}

//crear producto

const crearProducto = async(req, res = response) => {

    const { nombre, usuario, estado, categoria, precio, descripcion, disponible } = req.body;

    const nombreReal = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({ nombre : nombreReal });

    if ( productoDB ){
        return res.status(400).json({
            msg: 'El producto ya existe'
        });
    }

    try{
        //Generar data
        const data = {
            nombre: nombreReal,
            usuario: req.usuario._id,
            categoria,
            precio,
            descripcion
        }

        //creamos la categoria
        const producto = new Producto( data );
        
        //guardamos en db
        await producto.save();

        res.status(201).json(producto);

    } catch (error){

        res.status(400).json({
            msg: 'Algo fue mal producto'
        });

    }
}

//ACTUALIZAR CATEGORIA

const actualizarProducto = async(req, res = response) => {
    
    const { id } = req.params;
    
    const { _id, usuario, estado, ...data } = req.body;

    const nombre = req.body.nombre.toUpperCase();

    //TO DO Middleware estado & nombre
    //Compruebo prod estado

    let estadoProducto = await Producto.findById( id );

    if ( !estadoProducto.estado ){
        return res.status(401).json({
            msg: 'Hable con el administrador, producto inexistente'
        });
    } 

    //Compruebo prod nombre

    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ){
        return res.status(400).json({
            msg: 'El producto ya exisite'
        });
    }

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true } );

    res.status(201).json({
        producto
    });
}

//BORRAR CATEGORIA ESTADO: FALSE - SOLO ADMIN

const borrarProducto = async(req, res = response) => {

    const { id , estado } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false } , { new: true });

    res.json({
        msg: 'Categoria borrado',
        producto
    });
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
}
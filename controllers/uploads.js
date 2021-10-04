const path = require('path');
const fs = require('fs');

const { response } = require("express");

const { subirArchivo, existeIdColeccion } = require("../helpers");

const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {
    
    try{
    //Imagenes , segundo param opcional, array tipo archivos permitidos, 3er argumento carpeta opcional, se creara si no existe siempre dentro de uploads
    // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
    const nombre = await subirArchivo( req.files );
    res.json({ nombre });
    } catch ( msg ) {
        res.status(400).json({
            msg
        });
    }
}

const actualizarImage = async(req, res = response) => {

        const { coleccion, id} = req.params;

        let modelo = await existeIdColeccion( coleccion, id);

        if (!modelo){
            return res.status(400).json({ msg: `No existe en ${coleccion} ese id, o no es una coleccion valida`});
        }

        //limpiar imagenes previas
        try{
            
            if ( modelo.img ){
                const pathImagen = path.join(__dirname,'../uploads/', coleccion , modelo.img);
                if( fs.existsSync(pathImagen)){
                    fs.unlinkSync(pathImagen);
                }   
            
            }
        }catch (error){
            res.json(error);
        }

        const nombre = await subirArchivo( req.files, undefined, coleccion );
        modelo.img = nombre;


        await modelo.save();
        
        res.json(modelo);

}

const mostrarImagen = async(req, res = response) => {
    
    const { coleccion, id} = req.params;

    let modelo = await existeIdColeccion( coleccion, id);

    if (!modelo){
        return res.status(400).json({ msg: `No existe en ${coleccion} ese id, o no es una coleccion valida`});
    }
    //limpiar imagenes previas
    try{
        
        if ( modelo.img ){
            const pathImagen = path.join(__dirname,'../uploads/', coleccion , modelo.img);
            if( fs.existsSync(pathImagen)){
               return res.sendFile( pathImagen);
            }   
        
        }
    }catch (error){
        return res.status(400).json(error);
    }

    const pathImagenDefecto = path.join(__dirname,'../assets/', 'no-image.jpg');

    res.sendFile(pathImagenDefecto);
}


module.exports = {

    cargarArchivo,
    actualizarImage,
    mostrarImagen
}
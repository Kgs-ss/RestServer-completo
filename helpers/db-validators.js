const Role = require('../models/role');

const { Usuario, Producto } = require('../models');

const esRoleValido = async( rol = '' ) => {
    
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(` El rol ${ rol } no esta registrado en la DB`);
    }
}

const emailExiste = async( correo = '') => {

    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ){
        throw new Error(`El correo ${ correo } ya esta registrado `);
    }
}

const existeUsuarioPorId = async( id = '') => {
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const existeUsuario = await Usuario.findById(id);
       
        if ( !existeUsuario ){
            throw new Error(`El id ${ id } no existe`);
        }

    } else {
        throw new Error(`${ id } no es una cadena valida`)
    }
}

const idValido= async( id = '') => {
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`${ id } no es una cadena valida`)
    } 
}

const Categoria = require('../models/categoria');

const existeCategoriaId = async( id = '') => {
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const existeCategoria = await Categoria.findById(id);
       
        if ( !existeCategoria ){
            throw new Error(`El id ${ id } no existe`);
        }

    } else {
        throw new Error(`${ id } no es una cadena valida`)
    }
}

const existeProductoId = async( id = '') => {
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const existeProducto = await Producto.findById(id);
       
        if ( !existeProducto ){
            throw new Error(`El id ${ id } no existe`);
        }

    } else {
        throw new Error(`${ id } no es una cadena valida`)
    }
}


const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = coleccion.includes( coleccion );
    if (!incluida){
        throw new Error(`La coleccion ${coleccion} no permitida debe ser ${colecciones}`);
    }

    return true;
}

const existeIdColeccion = async( coleccion = '', id ) => {

    let modelo;

    switch (coleccion){
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if (!modelo){
                    return false;
                }
            break;
        case 'productos':
                modelo = await Producto.findById(id);
                if (!modelo){
                    return false;
                }
            break;
        default:
            return false;
    }

    return modelo;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    idValido,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas,
    existeIdColeccion
    
}
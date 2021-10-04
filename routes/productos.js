const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdmin } = require('../middlewares');

const { existeCategoriaId, existeProductoId } = require('../helpers/');

const router = Router();

const { 
    obtenerProductos,
    crearProducto,
    obtenerProductoId,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

//obtener listado de productos
router.get('/',obtenerProductos);

//Obtener una categoria por id - publico
router.get('/:id',[ 
    check('id').custom( existeProductoId ),
    validarCampos
], obtenerProductoId);

//crear nuevo producto
router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaId ),
    validarCampos
], crearProducto );

//actualizar producto - con token
router.put('/:id', [
    validarJWT,
    check('nombre', 'el nombre es obligatoria').not().isEmpty(),
    check('id').custom( existeProductoId ),
    check('categoria').custom( existeCategoriaId ),
    validarCampos
], actualizarProducto);

//borrar categoria - privado - Admin
router.delete('/:id',[
    validarJWT,
    esAdmin,
    check('id').custom( existeProductoId ),
    validarCampos
], borrarProducto);

module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdmin } = require('../middlewares');
const { existeCategoriaId } = require('../helpers/');

const { 

    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaId,
    actualizarCategoria,
    borrarCategoria

} = require('../controllers/categorias');

const router = Router();

//Obtener todas las categorias -publico

router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id',[ 
    check('id').custom( existeCategoriaId ),
    validarCampos
], obtenerCategoriaId);

//Crear categoria - privado - con token
router.post('/', [
    validarJWT,
    check('nombre', 'el nombre es obligatoria').not().isEmpty(),
    validarCampos
], crearCategoria );

//Actualizar categoria - privado - con token
router.put('/:id', [
    validarJWT,
    check('nombre', 'el nombre es obligatoria').not().isEmpty(),
    check('id').custom( existeCategoriaId),
    validarCampos
], actualizarCategoria);

//borrar categoria - privado - Admin
router.delete('/:id',[
    validarJWT,
    esAdmin,
    check('id').custom( existeCategoriaId ),
    validarCampos
], borrarCategoria);

module.exports = router;
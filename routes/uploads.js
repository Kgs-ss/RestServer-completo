const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImage, mostrarImagen } = require('../controllers/uploads');
const { idValido, coleccionesPermitidas, } = require('../helpers/');

const { validarCampos, validarArchivoSubido } = require('../middlewares');

const router = Router();

router.get('/:coleccion/:id',[
    check('id').custom( idValido ),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

router.post('/', validarArchivoSubido, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubido,
    check('id').custom( idValido ),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImage);

module.exports = router;
const validarJWT = require('../middlewares/validar-JWT');
const validarRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validar-campos');
const validarArchivoSubido = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubido
}
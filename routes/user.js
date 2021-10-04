
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdmin,
    tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/');

const { 

    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete

} = require('../controllers/user');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    validarCampos
],
usuariosPut);

router.post('/', [
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('pass', 'El password debe ser de mas de 6 letraas').isLength({ min: 6}),
    check('correo', 'el correo no es valido').custom( emailExiste).isEmail(),
    // check('rol', 'rol no valido').isIn(['ADMIN_ROLE', 'USER_ROLE']), ahora se comprueba directamente contra la base
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    //esAdmin,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete);

//router.patch('/', usuariosPatch);

module.exports = router;

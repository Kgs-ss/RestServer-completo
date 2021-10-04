const { response } = require("express")


const esAdmin = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'se quiere verificar el rol sin haber validado el token'
        });
    }


    const { rol, nombre} = req.usuario;

    if ( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ nombre } no es administrador`
        });
    }

    next();
}

const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'se quiere verificar el rol sin haber validado el token'
            });
        }

        if ( !roles.includes( req.usuario.rol)){
            return res.status(401).json({
                msg: `para realizar la accion se requiere: ${ roles }`
            });
        }
        next();
    } 
}

module.exports = {

    esAdmin,
    tieneRole
}
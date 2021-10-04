const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    
    nombre: {
        type: String,
        required: [true, 'el nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'el correo es obligatorio'],
        unique: true
    },

    pass: {
        type: String,
        required: [true, 'el password es obligatorio']
    },

    img: {
        type: String,
    },

    rol: {
        type: String,
        required: true,
        // enum: ['ADMIN_ROLE', 'USER_ROLE'] ahora validamos contra la base queda como referencia
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    }
  

});

UsuarioSchema.methods.toJSON = function(){
    const { __v, _id, pass, ...usuario} = this.toObject();
    usuario.uid = _id
    return usuario;
}   


//Esto creara una coleccion de usuarios en la base de datos con la ayuda de mongoose
//tomara el nombre Usuario y le añadira un s, la coleccion seria Usuarios, si queremos otro nombre para ella podemos añadir un 3 param
//module.exports = model( 'Usuario', UsuarioSchema, 'nombre de la coleccion' );
module.exports = model( 'Usuario', UsuarioSchema );
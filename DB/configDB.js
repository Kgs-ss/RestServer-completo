const mongoose = require('mongoose');

const conexion = process.env.MONGO_CNN;

const dbConnection = async() => {

        await mongoose.connect( conexion, {
            useNewUrlParser: true
            }, (err, res) => {
                
                if (err) {
                    console.log(err)
                    throw new Error('Error al inicializar la BD')
                };

                console.log('DB online')
            });
            
}

module.exports = {
    dbConnection
}
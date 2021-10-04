// metemos express
const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../DB/configDB');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads', 
            usuarios:   '/api/usuarios',   
            
        }      

        //DB  connection
        this.conectarDB();

        //Middlewares
        this.middlewares();
        
        //Rutas de mi app
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        
        //cors
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );
        
        //Directorio publico
        this.app.use( express.static('public'));

        //FileUpload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //permite que se creen carpetas en la ruta de especificada en caso de que no exista
        }));

    }

    routes(){
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        this.app.use( this.paths.usuarios, require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log(`servidor corriendo en puerto ${this.port}`);
        });
    }
}

module.exports = Server;
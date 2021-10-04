const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = ''  ) => {


    return new Promise( ( resolve, reject ) => {
        
        const { archivo } = files;
    
        //extensiones
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1 ];

        if ( !extensionesValidas.includes(extension)){
            return reject('Tipo de archivo no permitido');
        }
        
        //nombre en el server
        const nombreTemp = uuidv4() + '.' + extension;

        //creacion de la ruta
        const uploadPath = path.join( __dirname,'../uploads/', carpeta , nombreTemp);
        
        //subida del archivo
        archivo.mv(uploadPath, (err) => {

        if (err) {
            reject( err );
        }
    
        resolve( nombreTemp );

        });


    })
   
}




module.exports = {
    subirArchivo
}
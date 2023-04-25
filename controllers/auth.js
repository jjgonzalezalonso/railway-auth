const {response} =require('express');
const { validationResult } = require('express-validator');
const Usuario = require ('../models/Usuario'); //lo he escrito
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res=response) =>{
    const {email, name, password} = req.body; //deserializamos el body
    try {
        // Verificar que no exista el email
            const usuario = await Usuario.findOne({email:email});
            // let usuario = await Usuario.findOne({email}); 
            // funciona pq el campo y la variable se llaman igual email
            if (usuario){
                return  res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya existe con ese email.'
                });
            }
        // Crear usuario con el modelo
        const dbUser = new Usuario(req.body);
         // Hashear(encriptar) la contraseña
         const salt=bcrypt.genSaltSync();
         dbUser.password=bcrypt.hashSync(password,salt);

         // Generar el JWT json web token
        const token = await generarJWT(dbUser.id, name);

        // Crear usuario de base de datos
        await dbUser.save();   
        // Generar la respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,
            email: dbUser.email,
            token
        });

    } catch (error) {
        console.log(error);
        //error interno: 500
        return  res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}


const loginUsuario = async (req,res=response) => {
    const {email,  password} = req.body; //deserializamos el body
    try {
        const dbUser = await Usuario.findOne({ email: email });
        if(  !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }
        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }
       // Generar el JWT
       const token = await generarJWT( dbUser.id, dbUser.name );
       // Respuesta del servicio, si no pongo status por defecto es 200 (BIEN)
       return res.json({
           ok: true,
           uid: dbUser.id,
           name: dbUser.name,
           email: dbUser.email,
           token
       });

    } catch (error) {
        console.log(error);
        return  res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
};

const revalidarToken=async(req,res=response) =>{
    //Leemos las variables que vienen en la request
    const { uid } = req;
    // Leer la base de datos
    const dbUser= await Usuario.findById(uid);
    // Generar el JWT
    const token = await generarJWT( uid, dbUser.name );
    
    return  res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}


module.exports={
    crearUsuario, loginUsuario,revalidarToken
};
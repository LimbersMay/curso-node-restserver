const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req, res = response, next) => {

    const token = req.header('x-token')
    
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // 1. Leer el usuario que corresponde al Token
        const usuario = await Usuario.findById(uid);

        // 2. Si el usuario no existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - No existe en DB'
            });
        } 

        // 3. Validar que el uid tenga un estado de true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Estado: false'
            });
        }
        
        // Ponemos la información del usuario dentro del request
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};


module.exports = {
    validarJWT
};
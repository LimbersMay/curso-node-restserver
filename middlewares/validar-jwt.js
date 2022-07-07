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
        const usuario = await Usuario.findOne({uid});
        
        // Ponemos la información del usuario dentro del request
        req.usuarioAutenticado = usuario;

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
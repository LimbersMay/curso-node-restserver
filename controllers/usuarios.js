const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const usuariosGet = (req, res = response) => {

    const {q, nombre, apikey} = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail){
        return res.status(404).json({
            msg: 'Este correo ya ha sido registrado'
        });
    }
    
    // Encriptar la contraseña (Hash de un solo camino)
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = (req, res) => {

    const id = req.params.id;

    res.json({
        msg: 'put API - Controlador',
        id
    })
};

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'Patch API - Controlador'
    })
};

const usuariosDelete = (req, res) => {

    res.json({
        msg: 'delete API - Controlador' 
    })
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};
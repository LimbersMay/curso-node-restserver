const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req, res = response) => {

    // const {q, nombre, apikey} = req.query;

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limite)
    ]);

    res.json({total, usuarios});
}

const usuariosPost = async(req, res) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    
    // Encriptar la contraseña (Hash de un solo camino)
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();

    res.json({usuario});
};

const usuariosPut = async(req, res) => {

    const {id} = req.params;
    const {password, google, ...resto} = req.body;

    // TODO: Validar contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        usuario
    });
};

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'Patch API - Controlador'
    });
};

const usuariosDelete = async(req, res) => {

    const { id } = req.params;
    
    // TODO: Actualizar el estado del usuario       
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

    // const usuarioAutenticado = ??
    const {usuarioAutenticado} = req;

    console.log('Req: ', req);
    console.log('Auth: ', usuarioAutenticado);

    res.json({
        usuario,
        usuarioAutenticado
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};
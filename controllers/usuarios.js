const { response } = require('express');


const usuariosGet = (req, res = response) => {

    const {q, nombre, apikey} = req.query;

    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPost = (req, res) => {

    const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - Controlador',
        nombre,
        edad
    })
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
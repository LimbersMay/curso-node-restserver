const { response } = require("express");
const { Categoria, Usuario } = require('../models');

// Obtener categorias - Paginado - total - populate
const obtenerCategorias = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
                 .populate('usuario', 'nombre')
                 .skip(Number(desde))
                 .limit(limite)
    ]);

    res.status(200).json({
        total,
        categorias
    });
}

// Obtener categoria - populate {}
const obtenerCategoriaPorId = async( req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    });
};

const crearCategoria = async( req, res = response ) => {

    const nombre      = req.headers.nombre.toUpperCase(); 
    const categoriaDB = await Categoria.findOne({nombre});

    if ( categoriaDB ) {
        return res.json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre: nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
}

// Actualizar categora
const actualizarCategoria = async( req, res = response ) => {

    const {   id   } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }); 

    res.status(200).json(
        categoria
    );
}  

// Borrar categoria - Cambiar estado a false
const borrarCategoria = async( req, res = response) => {

    if (req.usuario.rol !== 'ADMIN_ROLE') {
        res.status(401).json({
            msg: 'No tiene permiso para realizar esta acción'
        });
    }

    const { id } = req.params;
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.status(200).json(
        categoria
    );
}

module.exports = {
    crearCategoria,
    obtenerCategoriaPorId,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
};

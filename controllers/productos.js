const { response } = require('express');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const obtenerProductos = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, productos ] = await Promise.all([

        Producto.countDocuments(query),
        Producto.find(query)
                .populate('usuario')
                .populate('categoria')
                .skip(desde)
                .limit(limite)
    ]);

    res.status(200).json({
        total,
        productos
    });
}

const obtenerProductoPorId = async( req, res = response ) => {

    const { id } = req.params;


    const producto = await Promise.all([
        Producto.findById( id )
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
    ]);

    res.status(200).json({
        producto
    });
}

const crearProducto = async( req, res = response ) => {

    let { estado, usuario, ...body } = req.headers;

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto con el nombre ${ body.nombre } ya existe`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    // Si no existe
    const producto = new Producto( data );

    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async( req, res = response ) => {

    const { id } = req.params;

    let { estado, usuario,  ...data } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        producto
    });
}

const eliminarProducto = async( req, res = response ) => {

    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        productoBorrado
    });
}

module.exports = {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProductoPorId,
    obtenerProductos
}

const Role = require('../models/rol');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }

}

const emailExiste = async (correo) => {

    // Verificamos si el correo ya existe
    const existe = await Usuario.findOne({ correo });

    if (existe) {
        throw new Error(`El correo: ${correo}, ya ha sido registrado`);
    }
}

const existeUsuarioPorId = async (id) => {

    const existe = await Usuario.findById(id);

    if (!existe) {
        throw new Error(`El id ${id} no existe en la base de datos`);
    }
}

const existeCategoria = async (id) => {

    const categoria = await Categoria.findById(id);

    if (!categoria) {
        throw new Error(`La categoria con el id: ${id} no existe`);
    }
}

const existeProducto = async (id) => {

    const producto = await Producto.findById(id);

    if (!producto) {
        throw new Error(`El producto con el Id: ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}
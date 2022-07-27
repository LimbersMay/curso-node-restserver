const { Router } = require('express');
const { check } = require('express-validator');
const { 
    crearCategoria, 
    obtenerCategoriaPorId, 
    obtenerCategorias, 
    actualizarCategoria, 
    borrarCategoria
} = require('../controllers/categorias');

const { validarJWT, validarCampos } = require('../middlewares');

const { existeCategoria } = require('../helpers/db-validators');
 
const router = Router();

/*
    {{url}}/api/categorias
*/

// Obtener todas las categorias - Público
router.get('/', obtenerCategorias);

// Obtener una categoria por id
router.get('/:id', [
    check('id', 'El id no es un id de mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoriaPorId);

// Crear una nueva categoria - privado - Cualquier persona con un token válido 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - Token válido 
router.put('/:id', [
    validarJWT,
    check('id', 'El id no es un id de mongo válido').isMongoId(),
    check('id').custom( existeCategoria )
], actualizarCategoria);

// Borrar categoria - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'El id no es un id de mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria);

module.exports = router;

const { Router } = require('express'); 
const { check } = require('express-validator');

const { validarJWT, esAdminRole, validarCampos} = require('../middlewares');

const { 
    obtenerProductos, 
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,

} = require('../controllers/productos');

const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const router = Router();

// Público - Todos puedne acceder
router.get('/', [], obtenerProductos);

router.get('/:id', [
    check('id', 'El id no válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProductoPorId);

// Solo puede acceder con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria no es un Id de mongo').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto);

// Solo un admin puede hacer esta operación 
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un id de mongo válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], eliminarProducto);

module.exports = router;

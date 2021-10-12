const express = require('express');
const {
    createProduct,
    getAllProduct,
    getOneProduct,
    UpdateProduct,
    deleteProduct
} = require('../controllers/ProductController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();

router.post('/product', createProduct);
// ----------------------------------------------------------------------

router.get('/products', [auth, user], getAllProduct);
// ----------------------------------------------------------------------

router.get('/product/:id', [auth, user], getOneProduct);
// ----------------------------------------------------------------------

router.put('/product/:id', [auth, admin], UpdateProduct);
// ----------------------------------------------------------------------

router.delete('/product/:id', [auth, admin], deleteProduct);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
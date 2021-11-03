const express = require('express');
const {
    createProduct,
    getAllProduct,
    getOneProduct,
    UpdateProduct,
    deleteProduct,
    CheckrProductOnStock,
    getProductByCata
} = require('../controllers/ProductController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();

router.post('/product', createProduct);
// ----------------------------------------------------------------------

router.get('/products', getAllProduct);

router.get('/product/getProductByCata/:cataId', getProductByCata);

router.post('/CheckrProductOnStock', CheckrProductOnStock);
// ----------------------------------------------------------------------

router.get('/product/:id', getOneProduct);
// ----------------------------------------------------------------------

router.put('/product/:id', [auth, admin], UpdateProduct);
// ----------------------------------------------------------------------

router.delete('/product/:id', [auth, admin], deleteProduct);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
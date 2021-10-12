const express = require('express');
const order = require('../controllers/OrderController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// [auth, admin],
router.post('/Order', order.createOrder);
// ----------------------------------------------------------------------

router.get('/Orders', order.getAllOrder);
// ----------------------------------------------------------------------

router.get('/Order/:id', order.getOneOrder);
// ----------------------------------------------------------------------

router.put('/Order/:id', order.UpdateOrder);
// ----------------------------------------------------------------------

router.delete('/Order/:id', order.deleteOrder);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
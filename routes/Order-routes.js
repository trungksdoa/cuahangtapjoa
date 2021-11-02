const express = require('express');
const order = require('../controllers/OrderController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// [auth, admin],
router.post('/Order', [auth, user], order.createOrder);
// ----------------------------------------------------------------------

router.get('/Orders', order.getAllOrder);
// ----------------------------------------------------------------------
router.get('/getAllOrderByCus/:userId', [auth, user], order.getAllOrderByCus);
// ----------------------------------------------------------------------

router.get('/Order/:id', [auth, user], order.getOneOrder);
// ----------------------------------------------------------------------

router.put('/Order/:id', [auth, admin], order.UpdateOrder);
// ----------------------------------------------------------------------

router.delete('/Order/:id', [auth, admin], order.deleteOrder);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
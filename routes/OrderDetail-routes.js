const express = require('express');
const orderdetail = require('../controllers/OrderDetailController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// [auth, admin],
router.post('/Orderdetail', orderdetail.createOrderDetail);
// ----------------------------------------------------------------------

router.get('/Orderdetails', orderdetail.getAllOrderDetail);
// ----------------------------------------------------------------------

router.get('/Orderdetail/:id', orderdetail.getOneOrderDetail);
// ----------------------------------------------------------------------
router.get('/OrderdetailByOrder/:OrderID', orderdetail.getOneOrderDetailByOrder);
// ----------------------------------------------------------------------

router.put('/Orderdetail/:id', orderdetail.UpdateOrderDetail);
// ----------------------------------------------------------------------

router.delete('/Orderdetail/:id', orderdetail.deleteOrderDetail);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
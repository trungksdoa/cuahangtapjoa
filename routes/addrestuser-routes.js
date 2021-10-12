const express = require('express');
const address = require('../controllers/addressController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// , [auth, user], [auth, admin]

router.post('/Address', address.createAddress);
// ----------------------------------------------------------------------

router.get('/Addresss', address.getAllAddress);
// ----------------------------------------------------------------------

router.get('/Address/:id', address.getOneAddress);

// ----------------------------------------------------------------------

router.get('/getAllByCus/:id', address.GetAllDataBycus);

// ----------------------------------------------------------------------

router.put('/Address/:id', address.UpdateAddress);
// ----------------------------------------------------------------------

router.delete('/Address/:id', address.deleteAddress);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
const express = require('express');
const address = require('../controllers/addressController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// , [auth, user], [auth, admin]

router.post('/Address', [auth, user], address.createAddress);
// ----------------------------------------------------------------------

router.get('/Addresss', [auth, user], address.getAllAddress);
// ----------------------------------------------------------------------

router.get('/Address/:id', [auth, user], address.getOneAddress);

// ----------------------------------------------------------------------

router.get('/getAddressAllByCus/:id', [auth, user], address.GetAllDataBycus);

// ----------------------------------------------------------------------

router.get('/getUsedAddress/:userId', [auth, user], address.getUsedAddress);

// ----------------------------------------------------------------------

router.put('/Address/:id', [auth, user], address.UpdateAddress);

// ----------------------------------------------------------------------

router.put('/Address/:id/:userId', [auth, user], address.UsedAddress);

// ----------------------------------------------------------------------

router.delete('/Address/:id', [auth, user], address.deleteAddress);
// ----------------------------------------------------------------------



module.exports = {
    routes: router
}
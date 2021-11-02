const express = require('express');
const Catagory = require('../controllers/CatagoryController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// , [auth, user], [auth, admin]

router.post('/Catagory', Catagory.createCatagory);
router.get('/Catagorys', Catagory.getAllcatagory);
router.get('/Catagory/:id', Catagory.getOneCatagory);
module.exports = {
    routes: router
}
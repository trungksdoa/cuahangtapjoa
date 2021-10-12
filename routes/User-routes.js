const express = require('express');
const authen = require('../controllers/auth');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();

router.post('/login', authen.Login);
router.post('/RequestToken', [auth, user], authen.RequestToken);
router.post('/Register', authen.Register);
router.get('/users', authen.FindALl);
router.get('/user/:id', [auth, user], authen.getOne);
router.put('/user/:id', [auth, user], authen.update);
router.delete('/user/:id', authen.deletes);


module.exports = {
    routes: router
}
const express = require('express');
const Likes = require('../controllers/LikesController');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
const router = express.Router();
// , [auth, user], [auth, admin]

router.post('/Like', [auth, user], Likes.CreateLikes);
// ----------------------------------------------------------------------
router.get('/Likes/:cusId', [auth, user], Likes.getAllLikeByCus);
// ----------------------------------------------------------------------
router.delete('/Like/:id', [auth, user], Likes.deleteLike);
// ----------------------------------------------------------------------
router.get('/Like/:id', [auth, user], Likes.getOneLike);

router.get('/LikesMost', Likes.getAllMostLike);
module.exports = {
    routes: router
}
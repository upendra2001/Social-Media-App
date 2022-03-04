var express = require('express');
var router = express.Router();
// var router=require('express-promise-router')();

var followController = require('./controllers/followController');
var postController = require('./controllers/postController');
var userController = require('./controllers/userController');

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
            next();
    }
    else {
        res.redirect('/');
    }
};
const isLoggednIn = (req, res, next) => {
    if (req.session.isAuth) {
        res.redirect('/home-dashboard');
    }
    else {
        next();
    }
};



router.get('/', isLoggednIn, userController.home_guest);
router.get('/home-dashboard', isAuth, userController.home_dashboard);
router.get('/profile/:username', isAuth, userController.profile);
router.post('/login', userController.user_login);
router.post('/register', userController.user_register);
router.post('/logout', isAuth, userController.user_logout);



router.get('/create-post', isAuth, postController.create_post_get);
router.post('/create-post', isAuth, postController.create_post_post);
router.get('/post/:id/edit', isAuth, postController.edit_post_get);
router.post('/post/:id/edit', isAuth, postController.edit_post_post);
router.post('/post/:id/delete', isAuth, postController.delete_post);
router.get('/post/:id', isAuth, postController.single_post_screen);







router.get('/profile/:username/following', isAuth, followController.profile_following);
router.get('/profile/:username/followers', isAuth, followController.profile_followers);
router.post('/addFollow/:username', isAuth, followController.add_follow);
router.post('/removeFollow/:username', isAuth, followController.remove_follow);


router.post('/search', isAuth, userController.search_profile);

module.exports = router;
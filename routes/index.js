// Load librares and controllers
const express = require('express');
const homeController  = require('../controllers/homeController');
const usersController = require('../controllers/userController');
const postController  = require('../controllers/postController');

const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes definition
const router = express.Router();

// Home
router.get('/',homeController.index);

// Users
router.get('/users/login',usersController.login);
router.post('/users/login',usersController.loginAction);
router.get('/users/logout',usersController.logout);

router.get('/users/register',usersController.register);
router.post('/users/register',usersController.registerAction);
router.get('/users/forget',usersController.forget);
router.post('/users/forget',usersController.forgetAction);
router.get('/users/reset/:token',usersController.forgetToken);
router.post('/users/reset/:token',usersController.forgetTokenAction);

// Profile
router.get('/profile',authMiddleware.isLooged,usersController.profile);
router.post('/profile',authMiddleware.isLooged,usersController.profileAction);
router.post('/profile/password',authMiddleware.isLooged,authMiddleware.changePassword);

// Posts
router.get('/post/add',
            authMiddleware.isLooged,
            postController.add
);
router.post('/post/add',
            authMiddleware.isLooged,    
            imageMiddleware.upload,
            imageMiddleware.resize,
            postController.addAction
);

router.get('/post/:slug/edit', 
             authMiddleware.isLooged,
             postController.edit
);
router.post('/post/:slug/edit',
            authMiddleware.isLooged,
            imageMiddleware.upload,
            imageMiddleware.resize,
            postController.editAction

);
router.get('/post/:slug',postController.view);

module.exports = router;
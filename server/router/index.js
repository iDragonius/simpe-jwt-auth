const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')
const UserModel = require('../models/user-model')
const TokenModel = require('../models/token-model')
const jwt = require('jsonwebtoken')
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3, max:32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware , userController.getUsers);
router.get('/user', async (req, res)=>{
    const {refreshToken} = req.cookies 
    if(!refreshToken){
        throw new Error('error')
    }
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenData = await TokenModel.findOne({refreshToken})
    if (!userData || !tokenData) {
        throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findOne({user: tokenData.user})
    res.json({user})
})
module.exports = router
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHanler');


module.exports.register = async function (req, res) {
    //email password
    const confirmUser = await User.findOne({email: req.body.email});

    if (confirmUser) {
        res.status(409).json({
            message: 'email already exist'
        });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user);
        } catch (e) {
            errorHandler(res, e);
        }
    }
};

module.exports.login = async function (req, res) {
   const confirmUser = await User.findOne({email: req.body.email});

   if (confirmUser) {
       const passwordResult = bcrypt.compareSync(req.body.password, confirmUser.password);
       if (passwordResult) {
           const token = jwt.sign({
               email: confirmUser.email,
               userId: confirmUser._id
           }, keys.jwt, {expiresIn: 60 * 60});
           res.status(200).json({
               token: token
           });
       } else {
           res.status(401).json({
               message: 'Password is incorrect'
           });
       }
   } else {
       res.status(404).json({
           message: 'user not found'
       });
   }
};
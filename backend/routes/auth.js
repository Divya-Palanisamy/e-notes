const express = require('express') ;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Email already Exists!'
          });
        });
    });
  });

router.post('/signin', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(401).json({
                message: 'No user found'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Wrong Password'
            });
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id},
            process.env.SECRET_CODE, {
            expiresIn: process.env.EXPIRES_IN
        });
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });

    })
    .catch(err => {
        return res.status(401).json({
            message: 'Unable to login'
        });
    });
});

module.exports = router;
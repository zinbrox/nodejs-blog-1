const User = require('../models/schemas.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
        if(err) {
            res.json({
                err: err
            })
        }

        let user = new User.userModel({
            userId: req.body.userId,
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
    
        user.save()
            .then(user => {
                // res.json({
                //     message: 'User added successfully!'
                // })
                console.log("User added successfully");
                res.render('index');
            })
            .catch(error => {
                res.json({
                    message: `Error occured: ${error}`
                })
                console.log(`Error occured: ${error}`)
            })

    })

}

const login = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    User.userModel.findOne({$or: [{email:email}]})
        .then(user => {
            if(user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err) {
                        res.json({
                            error: err
                        })
                    }
                    if(result) {
                        let token = jwt.sign({name: user.name}, 'verySecretValue', {expiresIn: '1h'})
                        req.session.userId = user._id;
                        req.session.email = user.email;
                        req.session.name = user.name;
                        // res.json({
                        //     message: 'Login Successful',
                        //     token
                        // })
                        session=req.session;
                        
                        console.log("Login Successful");
                        console.log(`Session: ${session.email}`);
                        res.render('index');
                        // return;
                        //res.redirect('/');
                    }
                    else {
                        res.json({
                            message: 'Password does not match!'
                        })
                        console.log("Password does not match");
                    }
                })
            }
            else {
                res.json({
                    message: 'No user found!'
                })
                console.log("No user found");
            }
        })
}

module.exports = {
    register,
    login
}
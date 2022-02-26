const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');

// Bring in user model
const User = require('../../models/User');

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
    res.send('User Route');
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Include a valid email').isEmail(),
    body('password', 'Enter a password with at least 6 characters (at least 1 uppercase, 1 symbol, and 1 number)')
    .isStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }
    )
] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email: email });
        if(user){
            return res.status(400).json({ errors : [{ msg : 'User already exists' }] });
        }

        // Get user's gravatar
        const avatar = gravatar.url(email, {
            size: '200',
            rating: 'pg',
            default: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
        
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();
        // return the jsonwebtoken (So that the user is logged in right away)
        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            {
                expiresIn: 3600
            },
            (err, token) => {                 
                if(err) throw err;
                res.json({ token });
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');   
    }
});

module.exports = router;


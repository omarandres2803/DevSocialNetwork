const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', [
    body('email', 'Include a valid email').isEmail(),
    body('password', 'Enter a password')
    .exists()
] , async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email: email });
        if(!user){
            return res.status(400).json({ errors : [{ msg : 'Invalid Credentials' }] });
        }

        // Check that the password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ errors : [{ msg : 'Invalid Credentials' }] });
        }

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
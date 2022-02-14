const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

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
] ,(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    res.send(`You want to create a user called ${req.body.name}`);
});

module.exports = router;


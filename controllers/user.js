const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

router.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ error })
    }
});

router.post('/login', async (req, res) => {
    try {
        const isEmail = emailRegex.test(req.body.userhandle)
        const searchQuery = isEmail ? { email: req.body.userhandle } : { nick: req.body.userhandle }

        var user = await User.findOne(searchQuery);

        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        const payload = { ...user._doc, token };

        delete payload?.password
        delete payload?.__v

        res.send(payload);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error })
    }
});

module.exports = router;
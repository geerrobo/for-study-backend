const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        // Get user input
        const { username, password, email, firstName, lastName } = req.body

        // Validate user input
        if (!(username && password && email)) {
            return res.status(400).json({ "detail": "All input is required" });
        }

        // Validate email
        let validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!email.match(validEmail)) return res.status(400).json({ "detail": "Invalid email address" });

        const oldUser = await User.find({
            username: username
        })
        if (oldUser.length > 0) return res.status(409).json({ "detail": "User Already Exist." });

        //Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10)

        // Create user in our database
        try {
            User.create({
                username,
                password: encryptedPassword,
                email,
                firstName,
                lastName
            }, (err, result) => {
                if (err) res.status(500).json({ message: err.message })
                else {
                    delete result.password
                    delete result.__v
                    res.status(201).send(result)
                }
            })
        } catch (error) {
            res.status(400).json({ message: 'Error when insert user to database.' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body

        // Validate user input
        if (!(username && password)) {
            return res.status(400).json({ "detail": "All input is required" });
        }

        // Validate if user exist in our database
        let loginUser = await User.findOne({
            username: username
        })

        if (!loginUser) return res.status(400).json({ message: 'This user not found.' })

        if (!loginUser.isActive) return res.status(200).json({ message: 'This user is no longer used.' })

        if (!(await bcrypt.compare(password, loginUser.password)))
            return res.status(400).json({ message: 'Incorrect password.' })

        const token = jwt.sign({
            id: loginUser.id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: "30d"
        })

        res.status(200).json({
            id: loginUser.id,
            firstName: loginUser.firstName,
            isActive: loginUser.isActive,
            token: token
        })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const retrieve = async (req, res) => {
    try {
        const user = User.findById(req.params.id)
        delete user.password
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    register,
    login,
    retrieve
}
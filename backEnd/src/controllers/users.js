const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
const { generateJWT } = require("../middlewares/validateJWT.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
    }
});

function normalizeName(name) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

const httpUsers = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json({ users });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getUserById: async (req, res) => {
        try {
            const id = req.params.id
            const user = await User.findById(id);
            res.json({ user });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    createUser: async (req, res) => {
        try {
            const { USR_IDENTIFICATION, USR_NAME, USR_USERNAME, USR_PASSWORD, USR_EMAIL, USR_PHONE, USR_CREATED_BY_USER, USR_UPDATED_BY_USER } = req.body

            const cleanName = normalizeName(USR_NAME);

            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync(USR_PASSWORD, salt);

            const newUser = new User({ USR_IDENTIFICATION, USR_NAME: cleanName, USR_USERNAME, USR_PASSWORD: hashedPassword, USR_EMAIL, USR_PHONE, USR_CREATED_BY_USER, USR_UPDATED_BY_USER, USR_CREATED_BY_PASS: USR_CREATED_BY_USER });

            await newUser.save();
            res.json({ newUser });
        } catch (error) {
            res.status(400).json({ error });
            console.log(error);
        }
    },
    logInUser: async (req, res) => {
        try {
            const { USR_EMAIL, USR_PASSWORD } = req.body
            const user = await User.findOne({ USR_EMAIL });

            let dateNow = new Date()
            await User.findByIdAndUpdate(user._id, { USR_LAST_LOGIN: dateNow }, { new: true })

            const token = await generateJWT(user._id);

            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    sendResetEmail: async (req, res) => {
        try {
            const USR_EMAIL = req.body.USR_EMAIL;

            const user = await User.findOne({ USR_EMAIL });

            const token = jwt.sign({ uid: user._id }, process.env.SECRETORPRIVATEKEY, { expiresIn: "30m" });

            const urlReset = `http://localhost:5173/#/resetPass/${token}`

            const mailOptions = {
                from: process.env.EMAIL,
                to: USR_EMAIL,
                subject: "Reset password",
                text: `Click the following link to reset your password: ${urlReset}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                res.json({ msg: "Email sent." });
            });
        } catch (error) {
            res.status(400).json({ error });
            console.log(error);

        }
    },
    updateUser: async (req, res) => {
        try {
            const id = req.params.id
            const { USR_IDENTIFICATION, USR_NAME, USR_USERNAME, USR_EMAIL, USR_PHONE, USR_UPDATED_BY_USER } = req.body

            const cleanName = normalizeName(USR_NAME);

            const newUser = await User.findByIdAndUpdate(id, { USR_IDENTIFICATION, USR_NAME: cleanName, USR_USERNAME, USR_EMAIL, USR_PHONE, USR_UPDATED_BY_USER }, { new: true });

            res.json({ newUser });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    updateUserPassword: async (req, res) => {
        try {
            const { NEW_PASS, token } = req.body

            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            const salt = bcrypt.genSaltSync();
            const hashedPassword = bcrypt.hashSync(NEW_PASS, salt);
            let dateNow = new Date()

            await User.findByIdAndUpdate(decoded.uid, { USR_PASSWORD: hashedPassword, USR_UPDATED_BY_PASS: decoded.uid, USR_PASS_UPDATED_AT: dateNow });

            res.status(200).json({ msg: "Password saved successfully" });
        } catch (error) {
            res.status(400).json({ error });
            console.log(error);

        }
    },
    changeUserStatus: async (req, res) => {
        try {
            const { id, status } = req.params;

            await User.findByIdAndUpdate(id, { USR_STATE_USER: status });
            res.json({ msg: "User status updated" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            await User.findByIdAndDelete(id);
            res.json({ msg: "User deleted" });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
};

module.exports = { httpUsers };
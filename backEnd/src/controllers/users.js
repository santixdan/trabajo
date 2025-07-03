const User = require("../models/users.js");
const bcryptjs = require("bcryptjs");
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

const httpUsers = {
    getListAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json({ users });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListUserById: async (req, res) => {
        try {
            const ID = req.params.ID
            const user = await User.findById(ID);
            res.json({ user });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postCreateUser: async (req, res) => {
        try {
            const { USR_IDENTIFICATION, USR_NAME, USR_USERNAME, USR_PASSWORD, USR_EMAIL, USR_PHONE, USR_CREATED_BY_USER, USR_UPDATED_BY_USER } = req.body

            const cleanName = USR_NAME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

            const newUser = new User({ USR_IDENTIFICATION, USR_NAME: cleanName, USR_USERNAME, USR_PASSWORD, USR_EMAIL, USR_PHONE, USR_CREATED_BY_USER, USR_UPDATED_BY_USER, USR_CREATED_BY_PASS: USR_CREATED_BY_USER });

            const salt = bcryptjs.genSaltSync();
            newUser.USR_PASSWORD = bcryptjs.hashSync(USR_PASSWORD, salt);

            await newUser.save();
            res.json({ newUser });
        } catch (error) {
            res.status(400).json({ error });
            console.log(error);
        }
    },
    postLogInUser: async (req, res) => {
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
    postSendEmail: async (req, res) => {
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
    putUpdateUser: async (req, res) => {
        try {
            const ID = req.params.ID
            const { USR_IDENTIFICATION, USR_NAME, USR_USERNAME, USR_EMAIL, USR_PHONE, USR_UPDATED_BY_USER } = req.body

            const cleanName = USR_NAME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

            const newUser = await User.findByIdAndUpdate(ID, { USR_IDENTIFICATION, USR_NAME: cleanName, USR_USERNAME, USR_EMAIL, USR_PHONE, USR_UPDATED_BY_USER }, { new: true });

            res.json({ newUser });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putUpdatePassUser: async (req, res) => {
        try {
            const { NEW_PASS, token } = req.body

            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync(NEW_PASS, salt);
            let dateNow = new Date()

            await User.findByIdAndUpdate(decoded.uid, { USR_PASSWORD: hashedPassword, USR_UPDATED_BY_PASS: decoded.uid, USR_PASS_UPDATED_AT: dateNow });

            res.status(200).json({ msg: "Password save successfully" });
        } catch (error) {
            res.status(400).json({ error });
            console.log(error);
            
        }
    },
    putChangeStatusUser: async (req, res) => {
        try {
            const {ID, STATUS} = req.params;
            await User.findByIdAndUpdate(ID, { USR_STATE_USER: STATUS });
            res.json({ msg: "Save user" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const ID = req.params.ID;
            await User.findByIdAndDelete(ID);
            res.json({ msg: "Deleted user" });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
};

module.exports = { httpUsers };
const User = require("../models/users.js");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../middlewares/validateJWT.js");

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
            const { USR_IDENTIFICATION, USR_NAME, USR_USERNAME, USR_PASSWORD, USR_EMAIL, USR_PHONE, USR_ACTION } = req.body

            const cleanName = USR_NAME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

            const newUser = new User({ USR_IDENTIFICATION, USR_NAME: cleanName, USR_USERNAME, USR_PASSWORD, USR_EMAIL, USR_PHONE, USR_CREATED_BY_USER: USR_ACTION, USR_UPDATED_BY_USER: USR_ACTION });

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
            await User.findByIdAndUpdate(user._id, {USR_LAST_LOGIN: dateNow }, { new: true })

            const token = await generateJWT(user._id);

            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putUpdateUser: async (req, res) => {
        try {
            const ID = req.params.ID
            const { USR_IDENTIFICATION, USR_NAME, USR_USERNAME, USR_EMAIL, USR_PHONE, USR_ACTION } = req.body

            const cleanName = USR_NAME.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

            const newUser = await User.findByIdAndUpdate(ID, { USR_IDENTIFICATION, USR_NAME: cleanName, USR_USERNAME, USR_EMAIL, USR_PHONE, USR_UPDATED_BY_USER: USR_ACTION }, { new: true });

            res.json({ newUser });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putActiveUser: async (req, res) => {
        try {
            const ID = req.params.ID;
            await User.findByIdAndUpdate(ID, { USR_STATE_USER: 1 });
            res.json({ msg: "Usuario activado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putDeactiveUser: async (req, res) => {
        try {
            const ID = req.params.ID;
            await User.findByIdAndUpdate(ID, { USR_STATE_USER: 0 });
            res.json({ msg: "Usuario desactivado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const ID = req.params.ID;
            await User.findByIdAndDelete(ID);
            res.json({ msg: "Usuario eliminado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
};

module.exports = { httpUsers };
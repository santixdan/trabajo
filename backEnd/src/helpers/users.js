const User = require("../models/users.js")
const bcryptjs = require("bcryptjs")

const usersHelpers = {
    validatePassUser: async (USR_EMAIL, USR_PASSWORD) => {
        const user = await User.findOne({ USR_EMAIL })
        if (!user) {
            throw new Error("User not found or invalid credentials");
        }
        if ([2,3,4,5].includes(user.USR_STATE_USER)) {
            throw new Error("User not found or invalid credentials");
        }
        const validPassword = bcryptjs.compareSync(USR_PASSWORD, user.USR_PASSWORD);
        if (!validPassword) {
            throw new Error("User not found or invalid credentials");
        }
    },
    validateIdentificationUser: async (USR_IDENTIFICATION) => {
        const user = await User.findOne({ USR_IDENTIFICATION });
        if (user) {
            throw new Error("Identification already in use");
        } return true
    },
    validateIdentificationUserUpdate: async (USR_IDENTIFICATION, id) => {
        const user = await User.findOne({ USR_IDENTIFICATION, _id: { $ne: id } });
        if (user) {
            throw new Error("Identification already in use");
        } return true
    },
    validateUsernameUser: async (USR_USERNAME) => {
        const user = await User.findOne({ USR_USERNAME });
        if (user) {
            throw new Error("Username already in use");
        } return true
    },
    validateUsernameUserUpdate: async (USR_USERNAME, id) => {
        const user = await User.findOne({ USR_USERNAME, _id: { $ne: id } });
        if (user) {
            throw new Error("Username already in use");
        } return true
    },
    validatePhoneUser: async (USR_PHONE) => {
        const user = await User.findOne({ USR_PHONE });
        if (user) {
            throw new Error("Phone number already in use");
        } return true
    },
    validatePhoneUserUpdate: async (USR_PHONE, id) => {
        const user = await User.findOne({ USR_PHONE, _id: { $ne: id } });
        if (user) {
            throw new Error("Phone number already in use");
        } return true
    },
    validateEmailUser: async (USR_EMAIL) => {
        const user = await User.findOne({ USR_EMAIL });
        if (user) {
            throw new Error("Email already in use");
        } return true
    },
    validateEmailUserUpdate: async (USR_EMAIL, id) => {
        const user = await User.findOne({ USR_EMAIL, _id: { $ne: id } });
        if (user) {
            throw new Error("Email already in use");
        } return true
    },
    validateIDUser: async (id) => {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        } return true
    },
    validateSentEmailUser: async (USR_EMAIL) => {
        const user = await User.findOne({ USR_EMAIL });
        if (!user) {
            throw new Error("User not found");
        } return true
    },
    validateBothPass: (NEW_PASS, CONF_PASS) => {
        if (NEW_PASS != CONF_PASS) {
            throw new Error("the passwords do not match");
        } return true
    },
    validateStatus: (STATUS) => {
        const allowedStatus = ["1", "2", "3", "4", "5"]
        if (!allowedStatus.includes(STATUS)) {
            throw new Error("Invalid status value");
        } return true
    }
}

module.exports = { usersHelpers };
const express = require('express');
const { httpUsers } = require('../controllers/users.js');
const userRouter = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.js');
const { validteJWT } = require('../middlewares/validateJWT.js');
const { usersHelpers } = require('../helpers/users.js');

//GET
userRouter.get("/listAllUsers", [
    validteJWT,
    validateFields
], httpUsers.getAllUsers)

userRouter.get("/listUserById/:id", [
    validteJWT,
    check("id", "ID must be valid").isMongoId(),
    check("id").custom(usersHelpers.validateIDUser),
    validateFields
], httpUsers.getUserById)

//POST
userRouter.post("/create", [
    validteJWT,
    check("USR_IDENTIFICATION", "Identification must be valid").notEmpty(),
    check("USR_IDENTIFICATION").custom(usersHelpers.validateIdentificationUser),
    check("USR_NAME", "Name must be valid").notEmpty(),
    check("USR_USERNAME", "Username must be valid").notEmpty(),
    check("USR_USERNAME").custom(usersHelpers.validateUsernameUser),
    check("USR_EMAIL", "Email must be valid").isEmail(),
    check("USR_EMAIL").custom(usersHelpers.validateEmailUser),
    check("USR_PHONE", "Phone number must be valid").isMobilePhone(),
    check("USR_PHONE").custom(usersHelpers.validatePhoneUser),
    validateFields
], httpUsers.createUser)

userRouter.post('/logIn', [
    check("USR_EMAIL", "Email must be valid").notEmpty(),
    check("USR_PASSWORD", "Password must be valid").notEmpty(),
    check("USR_EMAIL").custom(async (USR_EMAIL, { req }) => {
        await usersHelpers.validatePassUser(USR_EMAIL, req.body.USR_PASSWORD)
    }),
    validateFields
], httpUsers.logInUser)

userRouter.post('/sendEmail', [
    check("USR_EMAIL", "Email must be valid").isEmail(),
    check("USR_EMAIL").custom(usersHelpers.validateSentEmailUser),
    validateFields
], httpUsers.sendResetEmail)

//PUT
userRouter.put("/update/:id", [
    validteJWT,
    check("id", "ID must be valid").isMongoId(),
    check("id").custom(usersHelpers.validateIDUser),
    check("USR_IDENTIFICATION", "Identification must be valid").notEmpty(),
    check("USR_IDENTIFICATION").custom((USR_IDENTIFICATION, { req }) => {
        return usersHelpers.validateIdentificationUserUpdate(USR_IDENTIFICATION, req.params.id)
    }),
    check("USR_NAME", "Name must be valid").notEmpty(),
    check("USR_USERNAME", "Username must be valid").notEmpty(),
    check("USR_USERNAME").custom((USR_USERNAME, { req }) => {
        return usersHelpers.validateUsernameUserUpdate(USR_USERNAME, req.params.id)
    }),
    check("USR_EMAIL", "Email must be valid").isEmail(),
    check("USR_EMAIL").custom((USR_EMAIL, { req }) => {
        return usersHelpers.validateEmailUserUpdate(USR_EMAIL, req.params.id)
    }),
    check("USR_PHONE", "Phone must be valid").isMobilePhone(),
    check("USR_PHONE").custom(async (USR_PHONE, { req }) => {
        await usersHelpers.validatePhoneUserUpdate(USR_PHONE, req.params.id)
    }),
    check("status", "STATUS must be valid").notEmpty(),
    check("status").custom(usersHelpers.validateStatus),
    check("status_pass", "STATUS_PASS must be valid").notEmpty(),
    check("status_pass").custom(usersHelpers.validateStatus),
    validateFields
], httpUsers.updateUser)
userRouter.put("/changeStatus/:id", [
    validteJWT,
    check("id", "id must be valid").isMongoId(),
    check("id").custom(usersHelpers.validateIDUser),
    check("status", "STATUS must be valid").notEmpty(),
    check("status").custom(usersHelpers.validateStatus),
    validateFields
], httpUsers.changeUserStatus)
userRouter.put('/updatePass', [
    check("NEW_PASS", "Pass must be valid").notEmpty(),
    check("CONF_PASS", "Pass must be valid").notEmpty(),
    check("token", "Token must be valid").notEmpty(),
    check("NEW_PASS").custom((NEW_PASS, { req }) => {
        return usersHelpers.validateBothPass(NEW_PASS, req.body.CONF_PASS)
    }),
    validateFields
], httpUsers.updateUserPassword)

//DELETE
userRouter.delete("/delete/:id", [
    validteJWT,
    check("id", "ID must be valid").isMongoId(),
    check("id").custom(usersHelpers.validateIDUser),
    validateFields
], httpUsers.deleteUser)

module.exports = userRouter
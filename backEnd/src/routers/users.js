const express = require('express');
const { httpUsers } = require('../controllers/users.js');
const userRouter = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.js');
const { validteJWT } = require('../middlewares/validateJWT.js');
const { usersHelpers } = require('../helpers/users.js');

//GET
userRouter.get("/listAllUsers", [validteJWT, validateFields], httpUsers.getListAllUsers)

userRouter.get("/listUserById/:ID", [
    validteJWT, 
    check("ID","Invalid value").isMongoId(),
    validateFields
], httpUsers.getListUserById)

//POST
userRouter.post("/create", [
    check("USR_IDENTIFICATION", "Invalid value").notEmpty(),
    check("USR_NAME", "Invalid value").notEmpty(),
    check("USR_USERNAME", "Invalid value").notEmpty(),
    check("USR_PASSWORD", "Invalid value").notEmpty().isLength({ min: 5 }),
    check("USR_EMAIL", "Invalid value").isEmail(),
    check("USR_PHONE", "Invalid value").isMobilePhone(),
    validateFields
], httpUsers.postCreateUser)

userRouter.post('/logIn', [
    check("USR_EMAIL", "Invalid value").notEmpty(),
    check("USR_PASSWORD", "Invalid value").notEmpty(),
    check("USR_EMAIL").custom(async (USR_EMAIL, { req }) => {
        await usersHelpers.validatePassUser(USR_EMAIL, req.body.USR_PASSWORD)
    }),
    validateFields
], httpUsers.postLogInUser)

//PUT
userRouter.put("/update/:ID", [validteJWT, validateFields], httpUsers.putUpdateUser)
userRouter.put("/active/:ID", [validteJWT, validateFields], httpUsers.putActiveUser)
userRouter.put("/deactive/:ID", [validteJWT, validateFields], httpUsers.putDeactiveUser)

//DELETE
userRouter.delete("/delete/:ID", [
    validteJWT, 
    check("ID","Invalid value").isMongoId(),
    validateFields
], httpUsers.deleteUser)

module.exports = userRouter
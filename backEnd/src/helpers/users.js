const User = require("../models/users.js")
const bcryptjs = require("bcryptjs")

const usersHelpers = {
    validatePassUser: async (email, password) => {
        const user = await User.findOne({ USR_EMAIL : email })
        if (!user) {
            throw new Error("Usuario o contraseña incorrecta")
        }
        const validPassword = bcryptjs.compareSync(password, user.USR_PASSWORD);
        if (!validPassword) {
            throw new Error("Usuario o contraseña incorrecta")
        }
    }
}

module.exports = { usersHelpers };
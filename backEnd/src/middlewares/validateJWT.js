const jwt = require('jsonwebtoken');
const User = require("../models/users.js")


const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "1h"
        }, (err, TOKEN) => {
            if (err) {
                reject("Credentials error1")
            } else {
                resolve(TOKEN)
            }
        })
    })
}

const validteJWT = async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
        return res.status(401).json({
            msg: "Credentials error2"
        })
    }
    try {
        let userLogged;

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        if(!uid){
            return res.status(401).json({
                msg: "Credentials error3"
            })
        }
        userLogged = await User.findById(uid);
        if (!userLogged) {
            return res.status(401).json({
                msg: "Credentials error4"
            })
        }

        if ([2,3,4,5].includes(userLogged.USR_STATE_USER)) {
            return res.status(401).json({
                msg: "Credentials error5"
            })
        }

        next();

    } catch (error) {
        res.status(401).json({
            msg: "Credentials error6"
        })
        console.log(error);
        
    }
}


module.exports = { generateJWT, validteJWT }
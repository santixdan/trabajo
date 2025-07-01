const jwt = require('jsonwebtoken');
const User = require("../models/users.js")


const generateJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            //100 years
            expiresIn: "1h"
        }, (err, token) => {
            if (err) {
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const validteJWT = async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
        return res.status(401).json({
            msg: "Error en la petición"
        })
    }
    try {
        let userLogged;

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        if(!uid){
            return res.status(401).json({
                msg: "Error en la petición"
            })
        }
        userLogged = await User.findById(uid);
        if (!userLogged) {
            return res.status(401).json({
                msg: "Error en la petición"
            })
        }

        if (userLogged.USR_STATE_USER == 0) {
            return res.status(401).json({
                msg: "Error en la petición"
            })
        }

        next();

    } catch (error) {
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}


module.exports = { generateJWT, validteJWT }
const jwt = require('jsonwebtoken');
const Usuario = require("../models/users.js")


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
        let usuario;

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        if(!uid){
            return res.status(401).json({
                msg: "Error en la petición"
            })
        }
        usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                msg: "Error en la petición"//- usuario no existe DB
            })
        }

        // if (usuario.estado == 0) {
        //     return res.status(401).json({
        //         msg: "Token no válido!!  " //- instructor con estado: false
        //     })
        // }

        next();

    } catch (error) {
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}


module.exports = { generateJWT, validteJWT }
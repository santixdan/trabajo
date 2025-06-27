const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.mongo_uri = process.env.MONGO_URI
        this.paths = {
            users: '/users'
        };
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors({
            origin: [
                'http://localhost:5173',
                'http://localhost:7000'
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Accept', 'X-Requested-With']
        }));
        this.app.use(express.static('public'));
    }
    routes() {
        this.app.use(this.paths.users, require('./routers/users.js'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`El servidor está funcionando en el puerto ${this.port}`);
            mongoose.connect('mongodb://127.0.0.1:27017/test').then(() => console.log('Connected!'))
        });
    }
}
module.exports = Server
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    USR_IDENTIFICATION: { type: String, unique: true },
    USR_STATE_USER: { type: Number, default: 1 },
    USR_STATE_PASS: { type: Number, default: 1 },
    USR_NAME: { type: String },
    USR_USERNAME: { type: String, unique: true },
    USR_PASSWORD: { type: String },
    USR_EMAIL: { type: String, unique: true },
    USR_PHONE: { type: String, unique: true },
    USR_LAST_LOGIN: { type: Date },
    USR_CREATED_BY_USER: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    USR_UPDATED_BY_USER: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    USR_CREATED_BY_PASS: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    USR_UPDATED_BY_PASS: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    USR_PASS_CREATED_AT: { type: Date },
    USR_PASS_UPDATED_AT: { type: Date }
}, { timestamps: { createdAt: 'USR_CREATED_AT', updatedAt: 'USR_UPDATED_AT' } })

usersSchema.pre('save', function (next) {
    if (this.isNew) {
        this.USR_PASS_CREATED_AT = this.USR_CREATED_AT;
        this.USR_LAST_LOGIN = this.USR_CREATED_AT;
        this.USR_PASS_UPDATED_AT = this.USR_CREATED_AT;
        this.USR_UPDATED_BY_PASS = this.USR_CREATED_BY_PASS;
    }
    next();
});

module.exports = mongoose.model("Users", usersSchema)
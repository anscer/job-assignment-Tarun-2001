const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { access_token } = require('../helper/generateAccessToken');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true }
}, {
    timestamps: true,
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return access_token({
        token_payload: {
            userId: this._id,
        }
    });
};

UserSchema.methods.comparePassword = async function (password) {
    const comparePassword = await bcrypt.compare(password, this.password);
    return comparePassword;
};

const User = mongoose.model('User', UserSchema);
module.exports = User
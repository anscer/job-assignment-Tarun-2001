const mongoose = require('mongoose')

const StateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }
});

const State = mongoose.model('State', StateSchema);
module.exports = State
const mongoose = require('mongoose')

const dbConnection = async (mongoUrl) => {
    try {
        await mongoose.connect(mongoUrl)
        console.log("Connected to mongoDB");
    }
    catch (error) {
        console.log("Unable to connect to DB")
    }
}

module.exports = {dbConnection}
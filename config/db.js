const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const db = {
    connect:()=> {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => {
                console.log("Database is connected.")
            }).catch((err) => {
                console.log("Error connecting to MongoDB", err)
            })

    }
}

module.exports = db

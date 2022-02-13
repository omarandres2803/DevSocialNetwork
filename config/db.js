// In this file we do the mongoDB connection

const mongoose = require("mongoose");
const config = require("config");

// Get a value from the config file
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(db);

        console.log('📓 MongoDB Connected 👌 !');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;
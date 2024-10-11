const mongoose = require('mongoose');
require('dotenv').config()

const connection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE,);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
}

module.exports = connection
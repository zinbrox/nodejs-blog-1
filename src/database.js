// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const databaseConnect = () => {
    return mongoose
        .connect('mongodb+srv://admin:admin@cluster0.cvdm1um.mongodb.net/?retryWrites=true&w=majority')
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.log(`Connection to MongoDB failed: ${error}`))
}
module.exports = databaseConnect;
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MongoDB_URL)
        console.log(`db conected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;

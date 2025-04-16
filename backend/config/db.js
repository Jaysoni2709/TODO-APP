const mongoose = require('mongoose');
console.log("process.env.MONGODB_URL",process.env.MONGODB_URL)
class Database {
    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/TODO")
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log(err));
    }
}

module.exports = new Database();
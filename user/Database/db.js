const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/salon')
.then(()=>{
    console.log('Mongo Db connected');
}).catch((error)=>{
    console.log('Error connection');
});

module.exports = db;

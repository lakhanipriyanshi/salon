
   const mongoose = require('mongoose');

   const databaseUrl = process.env.DATABASE_URL;

   const db = mongoose.connect(databaseUrl)
   .then(()=>{
      console.log('Mongo Db connected');
   }).catch((error)=>{
      console.log('Error connection');
   });

   module.exports = {
      db,
   };

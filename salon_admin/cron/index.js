var cron = require('node-cron');
const {log1} = require("../utils/general.lib");
const { cronnotification } = require("../cron/cron.controller");

const cronfile = function(){
    cron.schedule('0 * * * *', async () => {  
        try{    
            await cronnotification();
            log1("cornnotification sent successfully");
        }catch(error){
            console.error("cron------------------------->",error);
        } 
    });
}

module.exports =  cronfile;
const { User } = require("../models/user.model");
const { notification } = require("../models/notification.model");
const Constants = require("../config/constant");
const { log1 } = require("../utils/general.lib");

const cronnotification = async function(){
    try{
    const users = await User.find();
        for(const user of users){
            await notification.create({
                userId :user._id,
                title: "SalonSync",
                description: `SalonSync provide best service and discount please visit.`,
                notificationType: Constants?.NOTIFICATION_TYPE?.SALONNOTIFICATION,
                is_user: true,
                });
        }
    log1("success notification sent");

    }
    catch(error){
        console.error('cronnotification------------------>',error);
    }
}

module.exports = {
    cronnotification
};
require("dotenv").config();

module.exports = {
   AUTH_TOKEN_LENGTH: 15, // authentication token length
   API_TOKEN_LENGTH: 35, // authentication token length
   CODE_LENGTH : 4,

   BOOKING_APPOINMENT: {
      PENDING: 1,
      ACCEPT: 2,
      REJECT: 3,
   },

   CATEGORY_STATUS:{
      INACTIVE:1,
      ACTIVE:2,
   },

   NOTIFICATION_TYPE:{
      BOOk:1,
      SALONNOTIFICATION:2,
   }

};

const messages = require("../utils/messages");
const General = require("../lib/general.lib");

module.exports = async (app) => {
  // handle error (which is not handled inside and unfortunately returned)
  app.use((error, req, res, next) => {
    if (!error.status || error.status === 500) {
      return General.error_res(messages.unexpectedError);
    } else {
      return General.error_res(error.message);
    }
  });

  // handle 404
  app.use("", (req, res, next) => {
    return res.render("404", {
      header: { title: 404 },
   });
  });
};

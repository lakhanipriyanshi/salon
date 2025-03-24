$(document).ready(function () {
    $("#verifyotp").on("submit", function (e) {
      e.preventDefault();
      let email = $("#email").val();
      let otp = $("#otp").val();
      if (!email || !otp) {
        userToast(2, "all filed are mandatroy", 1000);
        return;
      }
      postCall("/client/otpverfication" ,{email,otp}, function(res) {
        if (res.flag === 1) {
          userToast(1, res.msg,2000);
          setTimeout(() => {
          window.location.replace("/client/login");
          }, 2000);
        } else {
          userToast(2, res.msg,2000);
        }
      });
    });
  });

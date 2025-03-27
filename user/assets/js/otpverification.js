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
          userToast(res.flag, res.msg);
          setTimeout(() => {
          window.location.replace("/client/login");
          }, 2000);
        }
        else{
          userToast(res.flag, res.msg);
        }
      });
    });
  });

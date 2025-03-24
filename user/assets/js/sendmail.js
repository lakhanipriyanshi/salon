
$(document).ready(function () {
$("#submitButton").on("click", function (e) {
    e.preventDefault();

    const email = $("#emailInput").val();

    if (!email) {
      userToast(2, "Please enter email address", 2000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      userToast(2, "Please enter valid email Address", 1000);
      return;
    }
    postCall("/client/sendmail" , { email}, function(res) {
      if (res.flag === 1) {
        userToast(1, res.msg,2000);
        $("#emailInput").val("");
      } else {
        userToast(0, res.msg,2000);
      }
    });
  });
});

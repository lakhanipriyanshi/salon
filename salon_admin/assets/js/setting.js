$(document).ready(function () {
  $("#updatepass").on("submit", function (e) {
    e.preventDefault();

    const old_password = $("#old_password").val();
    const new_password = $("#new_password").val();
    const confirm_password = $("#confirm_password").val();
    const adminId = $("#adminId").val();

    if (!old_password || !new_password || !confirm_password) {
      adminToast(0, "Please fill all the fields");
      return;
    }

    if (old_password === new_password) {
      adminToast(0, "new password must be different from old password");
      return;
    }

    if (new_password !== confirm_password) {
      adminToast(0, "new password and confirm password must be match");
      return;
    }
    postCall(`/admin/setting/${adminId}` , {old_password,new_password,confirm_password}, function(res) {
      if (res.flag === 1) {
        adminToast(1, res.msg,2000);
        setTimeout(() => {
        window.location.replace("/admin/login");
        }, 2000);
      } else {
        adminToast(0, res.msg,2000);
      }
       
      });
    });
});

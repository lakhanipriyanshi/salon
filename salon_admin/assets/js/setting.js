$(document).ready(function () {
  $("#updatepass").on("submit", function (e) {
    e.preventDefault();

    const oldpassword = $("#old_password").val();
    const newpassword = $("#new_password").val();
    const confirmpassword = $("#confirm_password").val();
    const adminId = $("#adminId").val();

    if (!oldpassword || !newpassword || !confirmpassword) {
      adminToast(0, "Please fill all the fields");
      return;
    }

    if (oldpassword === newpassword) {
      adminToast(0, "new password must be different from old password");
      return;
    }

    if (newpassword !== confirmpassword) {
      adminToast(0, "new password and confirm password must be match");
      return;
    }

    $.ajax({
      url: "/admin/setting/" + adminId,
      type: "POST",
      data: {
        old_password: oldpassword,
        new_password: newpassword,
        confirm_password: confirmpassword,
      },

      success: function (data) {
        if (data.success) {
          adminToast(1, "Password updated successfully");
          setTimeout(() => {
            window.location.replace("/admin/login");
          }, 2000);
        } else {
          adminToast(0, data.message, "Failed to update password");
        }
      },
      error: function (err) {
        console.error("Error occurred:", err);
        adminToast(0, "An error occurred. Please try again.");
      },
    });
  });
});

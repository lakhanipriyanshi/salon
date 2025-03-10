$(document).ready(function () {
  $("#addform").on("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    var imag = $("#imag").val();
    if (!imag) {
      adminToast(2, "please select a image", 2000);
      return;
    }
    $.ajax({
      url: "/admin/addgallery",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          adminToast(1, response.message);
          setTimeout(() => {
            window.location.replace("/admin/gallery");
          }, 2000);
        } else {
          adminToast(0, response.message);
        }
      },
      error: function (error) {
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Unexpected error occurred.";
        adminToast(0, errorMessage || "Unexpected error occurred");
      },
    });
  });
});

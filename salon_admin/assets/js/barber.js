//Add
$(document).ready(function () {
  $("#addform").on("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(this);
    var imge = $("#imge").val();
    var bname = $("#bname").val();
    var btype = $("#btype").val();

    if (!imge || !bname || !btype) {
      adminToast(2, "all fields are required", 2000);
      return;
    }

    $.ajax({
      url: "/admin/addbarber",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.success) {
          adminToast(1, response.message, 2000);
          setTimeout(() => {
            window.location.replace("/admin/barber");
          }, 2000);
        } else {
          adminToast(0, response.message);
        }
      },
      error: function (error) {
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Unexpected error occurred.";
        adminToast(0, errorMessage);
      },
    });
  });

  //delete
  $('.delete_barber').on("click",function(){
    let id = $(this).data("id");
    $("#delete-barber").attr('data-barber-id',id);
  });

  $(".deletebarber").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("barber-id");
    $.ajax({
      url: "/admin/deletebarber/" + id,
      type: "POST",
      success: function (response) {
        if (response.success) {
          adminToast(1, response.message || "deleted succesfully", 2000);
          setTimeout(() => {
            window.location.replace("/admin/barber");
          }, 2000);
        } else {
          adminToast(0, response.message,2000);
        }
      },
      error: function (error) {
        adminToast(0, error);
      },
    });
  });

  //update

  $("#updateform").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var barberId = $("#barberId").val();

    $.ajax({
      url: "/admin/updatebarber/" + barberId,
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        adminToast(1, response.message, 2000);
        setTimeout(() => {
          window.location.replace("/admin/barber");
        }, 2000);
      },
      error: function (error) {
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Unexpected error occurred.";
        adminToast(0, "Error", errorMessage);
      },
    });
  });
});

//add
$(document).ready(function () {
  $("#addform").on("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(this);
    var simg = $("#simg").val();
    var sname = $("#sname").val();
    var sdesc = $("#sdesc").val();
    var sprice = $("#sprice").val();
    if (!simg || !sname || !sdesc || !sprice) {
      adminToast(2, "All Filed are Required", 2000);
      return;
    }

    $.ajax({
      url: "/admin/addservice",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.success) {
          adminToast(1, response.message,2000);
          setTimeout(() => {
            window.location.replace("/admin/service");
          },2000);
        } else {
          adminToast(0, response.message);
        }
      },
      error: function (error) {
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Unexpected error occurred.";
        adminToast(0, "Error message");
      },
    });
  });

  //delete

  $(".delete_service").on("click",function(){
    let id = $(this).data("id");
    $("#deleteservice").attr('data-service-id',id);
  });
  $(".delete-service").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("service-id");
    $.ajax({
      url: "/admin/deleteservice/" + id,
      type: "POST",
      success: function (data) {
        if (data.success) {
          adminToast(1, data.message,2000);
          setTimeout(() => {
          window.location.replace("/admin/service");
          }, 2000);
        } else {
          adminToast(0, data.message);
        }
      },
      error: function (error) {
        adminToast(0, "Error");
      },
    });
  });

  //Update

  $("#updateform").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var serviceId = $("#serviceId").val();

    $.ajax({
      url: "/admin/updateservice/" + serviceId,
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        adminToast(1, response.message,2000);
        setTimeout(()=>{
          window.location.replace("/admin/service");
        },2000);
      },
      error: function (error) {
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Unexpected error occurred.";
        adminToast(0, "Error: ");
      },
    });
  });
});

// update USer
$(document).ready(function () {
  $("#updateinfo").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const userId = $("#userId").val();

    $.ajax({
      url: "/admin/updateuser/" + userId,
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
   
      success: function (data) {
        if (!data.success) {
          adminToast(1, data.message, 2000);
          window.location.replace("/admin/user");
          return;
        } 
      },
      error: function (error) {
        const errorMessage = error.responseJSON
          ? error.responseJSON.message
          : "Unexpected error occurred.";
          adminToast(0,"Error",2000);
      },
    });
  });
  //Update Status 
  $(".update-status").on("click",function (e) {
    e.preventDefault();
    const userId = $(this).data('userid');
    const status = $(this).data('status');

    $.ajax({
      url:"/admin/updateuserstatus/" + userId,
      type: "POST",
      contentType: "application/json",
      data:JSON.stringify({status}),
      success:function(response){ 
        adminToast(1,response.message||'Successfully updated',2000);
        setTimeout(() => {
          // window.location.replace("/admin/updateuser/" + userId);
          window.location.replace("/admin/user");
     
        }, 2000);
       },
      error:function(){
        adminToast(2,"Error updating status",2000);
      }
    })
  });

  // add

  $("#adduserform").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    let username = $("#username").val();
    var mobileno = $("#mobileno").val();
    var email = $("#email").val();
    let password = $("#password").val();
    let gender = $("#gender").val();

    
    if (!username && !password && !email && !mobileno) {
      adminToast(2, "All fields are required", 2000);
      return;
    }
    if (!username) {
      adminToast(2, "Username is required", 1000);
      return;
    }

    if (username.length < 3 || username.length > 20) {
      adminToast(2, "Name must be between 3 and 20 characters", 3000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      adminToast(2, "Please enter valid email Address", 3000);
      return;
    }

    if (!mobileno) {
      adminToast(2, "Mobileno is required", 1000);
      return;
    }
    const phoneRegex = /^[0-9]{10}/;
    if (!phoneRegex.test(mobileno)) {
      adminToast(2, "Mobile number exactly 10 digit", 3000);
      return;
    }

    if (gender === "Select Gender") {
      adminToast(2, "Gender selection is required", 1000);
      return;
    }

    $.ajax({
      url: "/admin/adduser",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        if (!data.success) {
          adminToast(2, data.message, 2000);
          return;
        }
        adminToast(1,'User add sucessfully', 2000);
        window.location.replace("/admin/user");
      },
      error: function (error) {
        adminToast(0, "error", 2000);
      },
    });
  });


  // delete

  $('.delete_user').on("click",function(){
    let id = $(this).data("id");
    $('#delete-user').attr('data-user-id',id);
  })

  $(".deleteuser").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("user-id");
    $.ajax({
      url: "/admin/deleteuser/" + id,
      type: "POST",
      success: function (data) {
        if (data.success) {
          adminToast(1, data.message);
          window.location.replace("/admin/user");
        } else {
          adminToast(0, data.message);
        }
      },
      error: function (error) {
        adminToast(0, "Error: " + error);
      },
    });
  });
});
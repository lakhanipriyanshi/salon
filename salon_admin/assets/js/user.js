// update USer
$(document).ready(function () {
  $("#updateinfo").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const userId = $("#userId").val();

    
    postFormCall(`/admin/updateuser/${userId}`, formData, function(res) {
      if(res.flag === 1){
        adminToast(1,res.msg,2000);
        setTimeout(() => {
          window.location.replace("/admin/user");
          }, 2000);
      }
      else{
        adminToast(0,res.msg,2000);
      }
      });
  });
  


  //Update Status 
  $(".update-status").on("click",function (e) {
    e.preventDefault();
    const userId = $(this).data('userid');
    const status = $(this).data('status');

    postCall(`/admin/updateuserstatus/${userId}` , {status}, function(res) {
      if (res.flag === 1) {
        adminToast(1, res.msg,2000);
        setTimeout(() => {
        window.location.replace("/admin/user");
        }, 2000);
      } else {
        adminToast(0, res.msg,2000);
      }
    });
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

    
    if (!username || !password || !email || !mobileno) {
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

    postFormCall("/admin/adduser", formData, function(res) {
      if(res.flag === 1){
        adminToast(1,res.msg,2000);
        setTimeout(() => {
          window.location.replace("/admin/user");
          }, 2000);
      }
      else{
        adminToast(0,res.msg,2000);
      }
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

    postCall(`/admin/deleteuser/${id}` , {}, function(res) {
      if (res.flag === 1) {
        adminToast(1, res.msg,2000);
        setTimeout(() => {
        window.location.replace("/admin/user");
        }, 2000);
      } else {
        adminToast(0, res.msg,2000);
      }
    });
    
  });
});

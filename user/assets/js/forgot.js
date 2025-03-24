
//Forgot password 
$(document).ready(function () {
    $("#forgotPassword").on("submit", function (e) {
      e.preventDefault();
      const email = $("#email").val();
      const newpassword = $("#newpassword").val();
      const confirmpassword = $("#confirmpassword").val();
  
      console.log("AJAX is being called"); 
  
      if(!email && !newpassword && !confirmpassword){
        userToast(2, "Please fill all fields", 2000);
        return;
      }
      if(!email){
        userToast(2,'email not exits', 2000);
        return;
      }
      
      if(newpassword !== confirmpassword){
        userToast(2, "newpassword and confirm password must be match", 2000);
        return;
      }
  
      postCall("/client/forgot" ,{email,newpassword,confirmpassword}, function(res) {
        if (res.flag === 1) {
          userToast(1, res.msg,2000);
          setTimeout(() => {
          window.location.replace("/client/login");
          }, 2000);
        } else {
          userToast(0, res.msg,2000);
        }
      });
    });
  });
  
jQuery(function() {
   $("#email").val("");
   $("#password").val("");
   $(document).on('keyup', "#form-login input", function () {
      const email = $("#email").val();
      const password = $("#password").val();
       $("#btnLogin").prop("disabled", !(email && password));
   });
   
   $("#form-login input").on("keypress", function(event) {
      if (event.charCode === 13) {
         $("#btnLogin").trigger("click");
      }
   });

   $("#btnLogin").on("click", function() {
      $("#btnLogin").prop("disabled", true);

      const email = $("#email").val();
      const password = $("#password").val();
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
      
      let validationMessage = "";
      if (email.length === 0) {
          validationMessage = "Email is required. Please enter your email address.";
      } 
      else if (password.length === 0) {
          validationMessage = "Password must be at least 6 characters long. Please enter a valid password";
      } 
      else if (!emailRegex.test(email) && password.length < 6) {
          validationMessage = "Please enter a valid email address and ensure your password is at least 6 characters long.";
      } 
      else if (!emailRegex.test(email)) {
          validationMessage = "Invalid email address. Please enter a valid email address.";
      } 
     else if (email.length > 255) {      
         validationMessage = 'Email address is too long. Please enter a shorter email address.'
         }
      else if (password.length > 0 && password.length < 6) {
          validationMessage = "Please provide a valid password with a minimum length of 6 characters.";
      }
      
      if (validationMessage) {
          adminToast(0, validationMessage);
          setTimeout(() => {
            $("#btnLogin").prop("disabled", false); 
         }, 1000); 
          return;
      }
      postCall("/admin/login", { email, password }, function(res) {
         adminToast(res.flag, res.msg);
         if (res.flag === 1) {
            $("#btnLogin").prop("disabled", true);
           
            setTimeout(function() {
               window.open("/admin/dashboard", "_SELF");
            }, 500);
         }
         setTimeout(() => {
            $("#btnLogin").prop("disabled", false); 
         }, 1000); 
      })
   });
});




$(document).ready(function(){
   $('#form-login').on("submit",function(e){
      e.preventDefault();
      let email = $("#email").val();
      let password = $("#password").val();

      postCall("/admin/login" , {email,password}, function(res) {
         if (res.flag === 1) {
           adminToast(1, res.msg,2000);
           setTimeout(() => {
           window.location.replace("/admin/dashboard");
           }, 2000);
         } else {
           adminToast(0, res.msg,2000);
         }
       });
   });
});
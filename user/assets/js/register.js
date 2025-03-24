$(document).ready(function () {
    var submitbutton = document.getElementById('registerbtn');   
  
   $("#registerForm").on("submit", function (event) {
     event.preventDefault();
  
     let username = $("#username").val();
     let password = $("#password").val();
     let email = $("#email").val();
     let mobileno = $("#mobileno").val();
     let gender = $("#gender").val();

     if (!username && !password && !email && !mobileno) {
       userToast(2, "All fields are required", 2000);
       return;
     }
     if (!username) {
       userToast(2, "Username is required", 1000);
       return;
     }

     if (username.length < 3 || username.length > 20) {
       userToast(2, "Name must be between 3 and 20 characters", 3000);
       return;
     }

     if (!password) {
       userToast(2, "password is required", 1000);
       return;
     }
     if (password.length < 6) {
       userToast(2, "password atleast 6 character", 3000);
       return;
     }

     if (!email) {
       userToast(2, "email is required", 1000);
       return;
     }

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       userToast(2, "Please enter valid email Address", 3000);
       return;
     }

     if (!mobileno) {
       userToast(2, "Mobileno is required", 1000);
       return;
     }

     const phoneRegex = /^[0-9]{10}/;
     if (!phoneRegex.test(mobileno)) {
       userToast(2, "Mobile number exactly 10 digit", 3000);
       return;
     }
     if (gender === "Select Gender") {
       userToast(2, "Gender selection is required", 1000);
       return;
     }
     submitbutton.disabled = true;
     
     postCall("/client/register" ,{username,password,email,mobileno,gender}, function(res) {
       if (res.flag === 1) {
         userToast(1, res.msg,2000);
         setTimeout(() => {
         window.location.replace("/client/otpverfication");
         submitbutton.disabled = false;
         }, 2000);
       } else {
         userToast(0, res.msg,2000);
       }
       submitbutton.disabled = false;
     });
   });
 });
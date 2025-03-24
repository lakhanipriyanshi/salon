$(document).ready(function () {
    $("#contactForm").on("submit", function (e) {
      e.preventDefault();
      const name = $("#name").val();
      const email = $("#email").val();
      const subject = $("#subject").val();
      const message = $("#message").val();
  
      if (!name || !email || !subject || !message) {
        userToast(2, "Please fill All Field ", 2000);
        return;
      }
  
      if (name.length < 3 || name.length > 20) {
        userToast(2, "Name must be between 3 and 20 characters", 2000);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        userToast(2, "Please enter valid email Address", 1000);
        return;
      }
  
      if (subject.length < 5 || subject.length > 20) {
        userToast(2, "subject must be between 5 and 20 characters", 2000);
        return;
      }
  
      if (message.length < 10 || message.length > 255) {
        userToast(2, "message must be between 10 and 255 characters", 2000);
        return;
      }
  
      postCall("/client/contact/save" , { name,email,subject,message}, function(res) {
        if (res.flag === 1) {
          userToast(1, res.msg,2000);
          $("#contactForm")[0].reset();
        } else {
          userToast(0, res.msg,2000);
        }
      });
    });
       
  });
  
  
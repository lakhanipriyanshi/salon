$(document).on("click", "#loginBtn", function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let password = $("#password").val();
    if (!email && !password) {
      userToast(2, "all filed are mandatroy", 1000);
      return;
    }
    if (!email) {
      userToast(2, "Please enter email", 1000);
      return;
    }
    if (!password) {
      userToast(2, "Please enter password", 1000);
      return;
    }

    postCall("/client/login",{ email, password }, function(res) {
      if(res.flag === 1){
          userToast(res.flag,res.msg,2000);
          setTimeout(() => {
            window.location.replace("/client/home");
            }, 2000);
      }
      else{
        if(res.data.isVery === 1){
          userToast(res.flag, res.msg, 1000);
          setTimeout(() => {
            window.location.replace("/client/otpverfication");
          }, 2000);
        } else if (res.data.isVery === 3) {
            userToast(res.flag, res.msg, 1000);
        } else if(res.data.isVery === 0){
            userToast(res.flag,res.msg, 1000);
        }
        else{
          userToast(res.flag, res.msg,2000);
        }
      }
    });
  });
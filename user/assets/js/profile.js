
  //update profile

  $(document).ready(function () {
    $("#updateinfo").on("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(this);
      var userId = $("#userId").val();

      postFormCall("/client/profile", formData, function(res) {
        if(res.flag === 1){
          userToast(res.flag, res.msg);
          setTimeout(() => {
            window.location.replace("/client/home");
            }, 2000);
        }
        else{
          userToast(res.flag, res.msg);
        }
      });
    });
  });

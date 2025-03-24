$(document).ready(function () {
  $("#addform").on("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    var imag = $("#imag").val();
    if (!imag) {
      adminToast(2, "please select a image", 2000);
      return;
    }
    postFormCall("/admin/addgallery", formData, function(res) {
      if(res.flag === 1){
        adminToast(1,res.msg,2000);
        setTimeout(() => {
          window.location.replace("/admin/gallery");
          }, 2000);
      }
      else{
        adminToast(0,res.msg,2000);
      }
      });
  });
});

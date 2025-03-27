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
        adminToast(res.flag, res.msg);
        setTimeout(() => {
          window.location.replace("/admin/gallery");
          }, 2000);
      }
      else{
        adminToast(res.flag,res.msg);
       }
      });
  });
});

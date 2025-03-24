//add
$(document).ready(function () {
  $("#addform").on("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(this);
    var simg = $("#simg").val();
    var sname = $("#sname").val();
    var sdesc = $("#sdesc").val();
    var sprice = $("#sprice").val();
    if (!simg || !sname || !sdesc || !sprice) {
      adminToast(2, "All Filed are Required", 2000);
      return;
    }

   postFormCall("/admin/addservice", formData, function(res) {
    if(res.flag === 1){
      adminToast(1,res.msg,2000);
      setTimeout(() => {
        window.location.replace("/admin/service");
        }, 2000);
    }
    else{
      adminToast(0,res.msg,2000);
    }
    });
 });

  //delete
  $(".delete_service").on("click",function(){
    let id = $(this).data("id");
    $("#deleteservice").attr('data-service-id',id);
  });
  $(".delete-service").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("service-id");
    
 postCall(`/admin/deleteservice/${id}` , {}, function(res) {
  if (res.flag === 1) {
    adminToast(1, res.msg,2000);
    setTimeout(() => {
    window.location.replace("/admin/service");
    }, 2000);
  } else {
    adminToast(0, res.msg,2000);
  }
   
  });
  });

  //Update

  $("#updateform").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var serviceId = $("#serviceId").val();
    postFormCall(`/admin/updateservice/${serviceId}`, formData, function(res) {
      if(res.flag === 1){
        adminToast(1,res.msg,2000);
        setTimeout(() => {
          window.location.replace("/admin/service");
          }, 2000);
      }
      else{
        adminToast(0,res.msg,2000);
      }
      });
  });
});

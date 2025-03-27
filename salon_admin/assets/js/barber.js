//Add
$(document).ready(function () {
  $("#addform").on("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(this);
    var imge = $("#imge").val();
    var bname = $("#bname").val();
    var btype = $("#btype").val();

    if (!imge || !bname || !btype) {
      adminToast(2, "all fields are required", 2000);
      return;
    }

    postFormCall("/admin/addbarber", formData, function(res) {
      if(res.flag === 1){
        adminToast(res.flag,res.msg);
        setTimeout(() => {
          window.location.replace("/admin/barber");
          }, 2000);
      }
      else{
        adminToast(res.flag,res.msg);
      }
    });
  });

  //delete
  $('.delete_barber').on("click",function(){
    let id = $(this).data("id");
    $("#delete-barber").attr('data-barber-id',id);
  });

  $(".deletebarber").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("barber-id");

    postCall(`/admin/deletebarber/${id}` , {}, function(res) {
      if (res.flag === 1) {
        adminToast(res.flag,res.msg);
        setTimeout(() => {
        window.location.replace("/admin/barber");
        }, 2000);
      } else {
        adminToast(res.flag,res.msg);
      }
    });
  });

  //update

  $("#updateform").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var barberId = $("#barberId").val();

    postFormCall(`/admin/updatebarber/${barberId}`, formData, function(res) {
      if(res.flag === 1){
        adminToast(res.flag,res.msg);
        setTimeout(() => {
          window.location.replace("/admin/barber");
          }, 2000);
      }
      else{
        adminToast(res.flag,res.msg);
      }
    });
  });
});

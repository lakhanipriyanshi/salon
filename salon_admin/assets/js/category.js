//Add Form

$(document).ready(function () {
  $("#addform").on("submit", function (e) {
    e.preventDefault();

    const categorytype = $("#categorytype").val();
    const status = $("#status").val();

    if (!categorytype && !status) {
      adminToast(0, "Please fill all the field", 2000);
      return;
    }
    if (!categorytype) {
      adminToast(0, "Please add category", 2000);
      return;
    }
    if (!status) {
      adminToast(0, "Please select status", 2000);
      return;
    }
    postCall("/admin/addcategory" , {categorytype,status}, function(res) {
      adminToast(res.flag, res.msg);
      if (res.flag) {
        setTimeout(() => {
        window.location.replace("/admin/category");
        }, 2000);
      }
    });
  
  });

  //Update Status value using On change

  $(".category_status").on("change", function (e) {
    e.preventDefault();
    const categoryId = $(this).data("category-id");
    const status = $(this).val();

    postCall("/admin/updatestatus" , {categoryId,status}, function(res) {
      adminToast(res.flag, res.msg);
      if (res.flag) {
        setTimeout(() => {
        window.location.replace("/admin/category");
        }, 2000);
      }
    });
  });

  $(".deletecategory").on('click',function (){
    let id = $(this).data("id");
    $('#delete_category').attr('data-category-id',id);
  });
  $(".delete-category").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("category-id");
    
 postCall(`/admin/deletecategory/${id}` , {}, function(res) {
  if (res.flag === 1) {
    adminToast(res.flag, res.msg);
    setTimeout(() => {
    window.location.replace("/admin/category");
    }, 2000);
  } else {
    adminToast(res.flag, res.msg);
  }
   
  });
  });

});

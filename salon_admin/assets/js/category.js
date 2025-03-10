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

    $.ajax({
      url: "/admin/addcategory",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        categorytype: categorytype,
        status: status,
      }),
      success: function (response) {
        adminToast(1, "Add Category successfully");
        setTimeout(() => {
          window.location.replace("/admin/category");
        }, 2000);
      },
      error: function (xhr) {
        let errorMessage = "Error updating Category";
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        }
        adminToast(0, errorMessage);
      },
    });
  });

  //Update Status value using On change

  $(".category_status").on("change", function (e) {
    e.preventDefault();
    const categoryId = $(this).data("category-id");
    const newStatus = $(this).val();

    $.ajax({
      url: "/admin/updatestatus",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        categoryId: categoryId,
        status: newStatus,
      }),
      success: function (response) {
        adminToast(1, response.message || "Update Status successfully", 2000);
        setTimeout(() => {
          window.location.replace("/admin/category");
        }, 2000);
      },

      error: function (xhr) {
        let errorMessage = "Error updating status";
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        }
        adminToast(0, errorMessage, 2000);
      },
    });
  });


  $(".deletecategory").on('click',function (){
    let id = $(this).data("id");
    $('#delete_category').attr('data-category-id',id);
  });
  $(".delete-category").on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("category-id");
    $.ajax({
      url: "/admin/deletecategory/" + id,
      type: "POST",
      success: function (response) {
        if (response.success) {
          adminToast(1, response.message || "deleted succesfully", 2000);
          setTimeout(() => {
            window.location.replace("/admin/category");
          }, 2000);
        } else {
          adminToast(0, response.message,2000);
        }
      },
      error: function (error) {
        adminToast(0, error);
      },
    });
  });

});

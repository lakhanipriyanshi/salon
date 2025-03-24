//Add
    /*$('#addform').on('submit', function (event) {
      event.preventDefault();   
  
      var formData = new FormData(this); 
  
      $.ajax({
        url: '/admin/addabout', 
        type: 'POST',
        data: formData,
        contentType: false,  
        processData: false,  
        success: function (response) {
          if (response.success) {
            alert(response.message); 
            window.location.replace('/admin/about'); 
          } else {
            alert(response.message); 
          }
        },
        error: function (error) {
          const errorMessage = error.responseJSON ? error.responseJSON.message : 'Unexpected error occurred.';
          alert("Error: " + errorMessage); 
        }
      });
    });
*/


//update

$(document).ready(function () {
  $('#updateform').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var aboutId = $('#aboutId').val();
    if(!aboutId){
      adminToast(0,"about id not found",2000);
    }

    postFormCall(`/admin/updateabout/${aboutId}`, formData, function(res) {
      if(res.flag === 1){
        adminToast(1,res.msg,2000);
        setTimeout(() => {
          window.location.replace("/admin/about");
          }, 2000);
      }
      else{
        adminToast(0,res.msg,2000);
      }
      });
  });
});

//Add

// $(document).ready(function () {
//     $('#addform').on('submit', function (event) {
//       event.preventDefault();   
  
//       var formData = new FormData(this); 
//       var aboutId = $('#aboutId').val();
//       postFormCall(`/admin/about`, formData, function(res) {
//         if(res.flag === 1){
//           adminToast(res.flag,res.msg);
//           setTimeout(() => {
//             window.location.replace("/admin/about");
//             }, 2000);
//         }
//         else{
//           adminToast(res.flag,res.msg);
//         }
//         });

//     });

//   });

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
        adminToast(res.flag,res.msg);
        setTimeout(() => {
          window.location.replace("/admin/about");
          }, 2000);
      }
      else{
        adminToast(res.flag,res.msg);
      }
      });
  });
});

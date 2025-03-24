$(document).ready(function(){
    $(".booking_status_change").on('click',function(){
      let booksid = $(this).data('booksid');
      let userId = $(this).data('userid');

      $("#booking_accept_btn").attr("data-book-id", booksid).attr("data-userid",userId);
      $("#booking_reject_btn").attr("data-book-id", booksid).attr("data-userid",userId);
    });

    $('.booking').on('click', function(e){
        e.preventDefault();
        
        const status = $(this).data('status');
        let booksid = $(this).data('book-id');
        const userId = $(this).data('userid'); 
        if(!booksid){
          adminToast(2, "No book id provided", 2000);
          return;
        }

        postCall(`/admin/updatebookstatus/${booksid}` , {status,userId}, function(res) {
          if (res.flag === 1) {
            adminToast(1, res.msg,2000);
            setTimeout(() => {
            window.location.replace("/admin/book-appoinment");
            }, 2000);
          } else {
            adminToast(0, res.msg,2000);
          }
           
          });
          });
});

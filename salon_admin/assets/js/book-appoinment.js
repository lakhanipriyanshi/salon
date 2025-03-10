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
        console.log("status", status);
        let booksid = $(this).data('book-id');
        const userId = $(this).data('userid'); 
        console.log("userId-----------------------------------", userId);
        if(!booksid){
          adminToast(2, "No book id provided", 2000);
          return;
        }
        $.ajax({
            url:"/admin/updatebookstatus/" + booksid,
            type:'POST',
            contentType:'application/json',
            data:JSON.stringify({status,userId}),
            success:function(response){
                adminToast(1,response.message||'Successfully updated',2000);
                setTimeout(() => {
                  window.location.replace("/admin/book-appoinment");
             
                }, 2000);
            },
            error:function(){
              adminToast(2,"Error updating status",2000);
            }
        });
    });
});

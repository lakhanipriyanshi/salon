
//Gallery
$(document).ready(function () {
    $(".filter-category").on("click", function (e) {
      e.preventDefault();
      
      console.log("Category clicked:", $(this).data("cat-filter"));
      $(".filter-category").removeClass("filter-active");
      $(this).addClass("filter-active");
  
      const categoryId = $(this).data("cat-filter");
      let object = {
        categoryId: categoryId
      }
  
      postCall(`/client/gallery/${categoryId}`,object, function(res) {
        if(res.flag === 1){
            $(".portfolio-container").html(res.data.gallery_html || "");
          //userToast(1,res.msg ||"image load success",2000);
        }
        else{
          userToast(res.flag,res.msg,2000);
        }
      });
    }); 
  });
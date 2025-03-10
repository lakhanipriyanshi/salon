(function ($) {
  "use strict";

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 0) {
      $(".navbar").addClass("nav-sticky");
    } else {
      $(".navbar").removeClass("nav-sticky");
    }
  });

  // Dropdown on mouse hover
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 992) {
        $(".navbar .dropdown")
          .on("mouseover", function () {
            $(".dropdown-toggle", this).trigger("click");
          })
          .on("mouseout", function () {
            $(".dropdown-toggle", this).trigger("click").blur();
          });
      } else {
        $(".navbar .dropdown").off("mouseover").off("mouseout");
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Testimonials carousel
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    animateIn: "slideInDown",
    animateOut: "slideOutDown",
    items: 1,
    smartSpeed: 450,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],
  });

  // Blogs carousel
  $(".blog-carousel").owlCarousel({
    autoplay: true,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  // //Portfolio isotope and filter
  // var portfolioIsotope = $(".portfolio-container").isotope({
  //   itemSelector: ".portfolio-item",
  //   layoutMode: "fitRows",
  // });

  // $("#portfolio-flters li").on("click", function (e) {
  //   e.preventDefault();
  //   $("#portfolio-flters li").removeClass("filter-active");
  //   $(this).addClass("filter-active");

  //   portfolioIsotope.isotope({ filter: $(this).data("filter") });
  // });
})(jQuery);



$(document).ready(function () {
  $(".filter-category").on("click", function (e) {
    e.preventDefault();
    
    console.log("Category clicked:", $(this).data("cat-filter"));
    $(".filter-category").removeClass("filter-active");
    $(this).addClass("filter-active");

    const categoryId = $(this).data("cat-filter");
    
    console.log("categoryId---------------------", categoryId);
    let object = {
      categoryId: categoryId
    }

    $.ajax({
      url: "/client/gallery/"+ categoryId,
      type: "POST",
      data: object,
      success: function (data) {
          console.log("Received images:", data);
          $(".portfolio-container").html(data.html || "");
        userToast(1, data.message || "Image Load Success", 2000);
       },  
      error: function (error) {
        userToast(0, "error get image ", 2000);
      },
    });
  });
});


// $(document).ready(function () {
//   $(".filter-category").on("click", function (e) {
//     e.preventDefault();
    
//     console.log("Category clicked:", $(this).data("filter"));
//     $(".filter-category").removeClass("filter-active");
//     $(this).addClass("filter-active");

//     const categoryId = $(this).data("filter");
    
//     console.log("categoryId---------------------", categoryId);
//     let object = {
//       categoryId: categoryId
//     }

//     $.ajax({
//       url: "/client/gallery/"+ categoryId,
//       type: "POST",
//       data: object,
//       success: function (data) {
//         console.log("Received images:", data);
//         // $(".portfolio-container").html(data.html || "");

//         userToast(1, data.message || "Image Load Success", 2000);

//        },
      
//       error: function (error) {
//         userToast(0, "error get image ", 2000);
//       },
//     });
//   });
// });

$(document).ready(function () {
  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    const name = $("#name").val();
    const email = $("#email").val();
    const subject = $("#subject").val();
    const message = $("#message").val();

    if (!name || !email || !subject || !message) {
      userToast(2, "Please fill All Field ", 2000);
      return;
    }

    if (name.length < 3 || name.length > 20) {
      userToast(2, "Name must be between 3 and 20 characters", 2000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      userToast(2, "Please enter valid email Address", 1000);
      return;
    }

    if (subject.length < 5 || subject.length > 20) {
      userToast(2, "subject must be between 5 and 20 characters", 2000);
      return;
    }

    if (message.length < 10 || message.length > 255) {
      userToast(2, "message must be between 10 and 255 characters", 2000);
      return;
    }
    $.ajax({
      type: "POST",
      url: "/client/contact/save",
      contentType: "application/json",
      data: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
      }),
      success: function (result) {
        userToast(1, result.message || "Message sent succesfullly", 1000);
        $("#contactForm")[0].reset();
      },
      error: function () {
        userToast(
          0,
          "Failed to send the message. Please try again later.",
          2000
        );
      },
    });
  });
});

$(document).ready(function () {
  $("#submitButton").on("click", function (e) {
    e.preventDefault();

    const email = $("#emailInput").val();

    if (!email) {
      userToast(2, "Please enter email address", 2000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      userToast(2, "Please enter valid email Address", 1000);
      return;
    }

    $.ajax({
      type: "POST",
      url: "/client/sendmail",
      contentType: "application/json",
      data: JSON.stringify({ email: email }),
      success: function (response) {
        userToast(1, response.message || "Email sent Success", 1000);
        $("#emailInput").val("");
      },
      error: function (error) {
        userToast(
          0,
          (error.responseJSON && error.responseJSON.message) ||
            "Failed to send email. Try again later.",
          2000
        );
      },
    });
  });

  //update profile

  $(document).ready(function () {
    $("#updateinfo").on("submit", function (e) {
      e.preventDefault();

      var formData = new FormData(this);
      var userId = $("#userId").val();

      $.ajax({  
        url: "/client/profile",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
          if (data.success) {
            userToast(1, data.message || " Profile updated successfully", 1000);
            setTimeout(() => {
              window.location.replace("/client/home");
            }, 1000);
          } else {
            userToast(2, "update profile failed", 1000);
          }
        },
        error: function (error) {
          userToast(0, "Error updating profile", 1000);
        },
      });
    });
  });
});



// book-appoinment
$(document).ready(function(){
  //set min date in date
  let today = new Date().toISOString().split("T")[0];
  $('#date').attr('min',today);

  $('#bookapo').on("submit",function(e){
    e.preventDefault();
    var servicename = $('#service').val();
    var barbername  =$('#barber').val();
    var date =  $('#date').val();
    var sHour = $('#sHour').val();
    var sAMPM = $('#sAMPM').val();
    var bookdate  = "";
  
    if(!servicename || !barbername && !bookdate)
      {
        userToast(2, "All The Field Required",2000);
        return;
      }
  
      if(!date || !sHour || !sAMPM){
        userToast(2,"Please select  date-Time",2000);
        return;
      }  
    
    //set datetime format  
      if (date || sHour || sAMPM) {            
        let [year, month, day] = date.split('-');
        let hours = parseInt(sHour);
        if(sAMPM.toUpperCase() === "PM" && hours !== 12){
          hours += 12;
        }else if(sAMPM.toUpperCase() === "AM" && hours === 12){
          hours=0;
        }
        let dateObj = new Date(Date.UTC(year,month-1,day,hours,0,0,0))
        bookdate = dateObj.toISOString().replace('.000Z','.000+00:00'); 
        console.log("Bookdate:", bookdate);
      }
    
      $.ajax({
      url:"/client/book-appoinment",
      type:"POST",
      contentType:"application/json",
      data:JSON.stringify({servicename,barbername,bookdate}),
      success: function (response) {
        if (response.success) {
          console.log("Bookdate:", bookdate);
          userToast(1, response.message,10000);
          setTimeout(() => {
            window.location.replace("/client/home");
          }, 2000);
        }
      },
      error: function (error) {
 
        userToast(0, errorMessage || "Unexpected error occurred",2000);
      },
    });
  })

}); 




//User Toast Message
function userToast(flag, val, time) {
  $("#toast").remove();
  if (!val) return;

  var noti_html = document.createElement("div");
  var att = document.createAttribute("id");
  att.value = "toast";
  noti_html.setAttributeNode(att);
  if (flag == 1) {
    noti_html.className = "notification is-success";
  } else if (flag == 0 || flag == 2) {
    noti_html.className = "notification is-error";
  } else {
    noti_html.className = "notification is-warning";
  }
  $("body").append(noti_html);
  $(noti_html).html(val);
  if (typeof time == "undefined" || time == null) {
    time = 5000;
  }
  setTimeout(function () {
    $("#toast").remove();
    time == null;
  }, time);
}

//show notification dropdown
      function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
      }
      // Close the dropdown if the user clicks outside of it
      window.onclick = function (event) {
        if (!event.target.matches(".dropbtn")) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
              openDropdown.classList.remove("show");
            }
          }
        }
      };
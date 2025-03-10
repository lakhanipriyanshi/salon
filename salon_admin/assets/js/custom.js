function checkconnection() {
   if(!navigator.onLine){
      adminToast(0, "Please check your internet connection");
   }
}
window.addEventListener("online", checkconnection);
window.addEventListener("offline", checkconnection);

const postCall = (url, data, callback) => {
   checkconnection();
   $.ajax({
      type: "post",
      url,
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
         callback(response);
      },
   });
};

const postFileCall = (url, form, callback) => {
   checkconnection();
   $.ajax({
      type: "post",
      url,
      data: new FormData($("#" + form)[0]),
      contentType: false,
      cache: false,
      processData: false,
      success: function (response) {
         callback(response);
      },
   });
};

const postFormCall = (url, formData, callback) => {
   checkconnection();
   $.ajax({
      type: "post",
      url,
      data: formData,
      contentType: false,
      cache: false,
      processData: false,
      success: function (response) {
         callback(response);
      },
   });
};

function validateInputAdmin(element) {
   element.value = element.value.replace(/[^0-9]/g, '');
   let value = Number(element.value);
   if (value < 0) {
      element.value = '';
   } else if (value > 50) {
      element.value = '50';
   } else {
      element.value = value;
   }
}
function validateInputNumber(element) {
   let value = element.value;
   value = value.replace(/[^0-9.]/g, '');
   let parts = value.split('.');
   if (parts.length > 2) {
       value = parts[0] + '.' + parts.slice(1).join('');
       parts = value.split('.');
   }
   if (parts.length === 2) {
       let integerPart = parts[0];
       let decimalPart = parts[1].slice(0, 8); 
       value = integerPart + '.' + decimalPart;
   } else {
       let integerPart = parts[0].slice(0, 4); 
       value = integerPart;
   }
   element.value = value;
}



function adminToast(flag, val, time) {
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

var filter_url = "";
var filters = {
   totalItems: 0,
   itemPerPage: 10,
   currentPage: 1,
   totalPages: 1,
};
var multipleFilter = [];
var div_id = "";

$(document).ready(function () {
   $("#recordPerPage").val(filters.itemPerPage);
   $(document).on("click", ".page_no", function () {
      var cp = $(this).data("page");
      var table = $(this).data("table");
      filters.currentPage = cp;
      var furl = multipleFilter[table]["filter_url"];
      filterData(furl, table);
   });
});

function changeRecordPerPage(url, table) {
   var id = "";
   if (typeof table !== "undefined") {
      id = "-" + table;
   }
   var recPp = $("#recordPerPage" + id).val();
   if (isNaN(recPp)) {
      adminToast(0, "Please select valid page limit");
      return false;
   } else if (recPp == "") {
      filters.itemPerPage = 10;
      $("#recordPerPage").val(10);
   } else if (recPp < 1) {
      adminToast(0, "Please select valid page limit");
      return false;
   } else {
      filters.itemPerPage = recPp;
   }
   filters.currentPage = 1;

   if (typeof table === "undefined") {
      table = "table-data";
   }
   filterData(url, table);
}

async function filterData(url, table) {
   var token = $("#token").val();
   filters._token = token;
   if (typeof table === "undefined") {
      table = "table-data";
   }
   var flush = 1;
   if (
      typeof multipleFilter[table] !== "undefined" &&
      typeof multipleFilter[table]["filters"] !== "undefined"
   ) {
      flush = 0;
      $.each(multipleFilter[table]["filters"], function (k, v) {
         if (typeof filters[k] === "undefined") {
            filters[k] = v;
         }
      });
   } else {
      multipleFilter[table] = {};
   }
   var jdata = filters;
   filter_url = url;
   $(".pagination").addClass('pagination-disable');
   $(".pagination nav>ul>li").prop("disabled", true); // Disable buttons
   await $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(jdata),
      dataType: "json",
      contentType: "application/json",
      success: function (res) {
         if (res.flag === 0) {
            filters.totalItems = 0;
            filters.totalPages = 0;
            $("#" + table).html("");
            $(".pagination").html("");
         } else {
            $("#" + table).html(res.blade);
            filters.totalItems = res["total_record"];
            filters.totalPages =  filters.totalItems > 0 ? Math.ceil(filters.totalItems / filters.itemPerPage) : 0;
            if(filters.totalPages > 0){
              $('#pagination-div').removeClass('d-none');
               setPagination(table);
            }else{
               $('#pagination-div').addClass('d-none');
               $(".pagination").html("");
            }
         }

         if (res['is_filter_visible'] == 0) {
            $(`#${table}-list-pagination`).addClass("d-none");
         } else {
            $(`#${table}-list-pagination`).removeClass("d-none");
         }

         $(".pagination").removeClass('pagination-disable');
         $(".pagination button").prop("disabled", false); // Re-enable buttons
         $("#search_option_bet").prop("disabled", false);
         $("#wizard-next").prop("disabled", false);
         multipleFilter[table]["filters"] = filters;
         multipleFilter[table]["filter_url"] = filter_url;
         flushFilters(flush);
      },
   }).fail(function () {
      $(".pagination button").prop("disabled", false); 
   });
}

function flushFilters(keep) {
   if (keep) {
      filters = {
         totalItems: 0,
         itemPerPage: filters.itemPerPage,
         currentPage: 1,
         totalPages: 1,
      };
   } else {
      filters = {};
   }
}

function setFilters(searchObject, removeField) {
   filters = {...filters, ...searchObject};

   if(removeField) {
      filters[removeField] = "";
   }
   filters.currentPage = 1;
}

function resetFilters(searchObject, table) {
   if (
      typeof table !== "undefined" &&
      typeof multipleFilter[table] !== "undefined"
   ) {
      multipleFilter[table]["filters"] = filters;
   }
   filters = {...filters, ...searchObject};
   filters.currentPage = 1;
}

function paginationInput(e, cp, tp, table) {
   let newPage = $(e.target).val();
   if (!newPage) return false;

   newPage = Number(newPage);
   const currentPage = Number(cp);
   const totalPage = Number(tp);

   if (Number.isNaN(newPage) || Number.isNaN(totalPage) || newPage <= 0 || newPage > totalPage) {
      $(e.target).val(currentPage);
      return
   };

   filters.currentPage = newPage;
   var furl = multipleFilter[table]["filter_url"];
   filterData(furl, table);
}

function setPagination(table) {
   var tp = filters.totalPages;
   var cp = filters.currentPage;

   var p = prevPage(cp, tp, 0);
   var li = "";
   var fl =
      '<button class="pagination-item d-none d-md-inline-block pagination-btn page_no" data-page="' +
      1 +
      '"  data-table="' +
      table +
      '" data-type="f"><i class="fa-solid fa-angles-left"></i></button>';

   var ll =
      '<button data-page="' +
      tp +
      '" data-type="l" data-table="' +
      table +
      '" class="pagination-item d-none d-md-inline-block pagination-btn page_no"><i class="fa-solid fa-angles-right"></i></button>';

   var pp =
      '<button data-page="' +
      p +
      '" data-type="p"  data-table="' +
      table +
      '" class="pagination-item pagination-btn page_no"><i class="fa-solid fa-chevron-left"></i></button>';

   var p = prevPage(cp, tp, 1);

   var np =
      '<button data-page="' +
      p +
      '" data-type="n"  data-table="' +
      table +
      '" class="pagination-item pagination-btn page_no"><i class="fa-solid fa-chevron-right"></i></button>';

   var ns = "";
   var ps = "";

   li += '<div data-table="' +
      table +
      `" class="d-flex justify-content-center align-items-center i--pagination text-center"><input type="text" class="form-control shadow-none px-0 text-center pagination-input" value="${cp}" min="1" max="${tp}" onchange="paginationInput(event, ${cp}, ${tp}, '${table}')"><div class="p-divider">/</div><div>${tp}</div></div>`;

   li = fl + pp + ps + li + ns + np + ll;
   var cls1 = "";
   var cls2 = "";
   if ($(".pagination").hasClass(table)) {
      cls1 = "." + table;
      cls2 = "." + table;
   };

   $(cls1 + ".pagination").html(li);

   $(cls1 + " .page_no").each(function () {
      var tp = $(this).data("type");
      if (tp == cp) {
         $(this).addClass("active");
      }
   });

   let id = "";
   if (table !== "table-data") {
      id = "-" + table;
   }   
   $("#recordPerPage" + id).find("option[value='" + filters.itemPerPage + "']").attr("selected", true);

   if (cp == 1) {
      $(cls2 + ".pagination button:first-child")
         .removeClass("page_no")
         .addClass("pagination-disable");
      $(cls2 + ".pagination button:nth-child(2)")
         .removeClass("page_no")
         .addClass("pagination-disable");
   };

   if (cp == tp) {
      $(cls2 + ".pagination button:last-child")
         .removeClass("page_no")
         .addClass("pagination-disable");
      $(cls2 + ".pagination button:nth-last-child(2)")
         .removeClass("page_no")
         .addClass("pagination-disable");
   };
};

function prevPage(cp, tp, t) {
   var p = 1;
   if (t) {
      p = cp + 1 < tp ? cp + 1 : tp > 0 ? tp : 1;
   } else {
      p = cp - 1 > 0 ? cp - 1 : 1;
   };

   return p;
};

function nextDigit(cp, tp, t) {
   if (t) {
      for (i = cp; i <= tp; i++) {
         if (i % 7 == 0) {
            return i;
         };
      };
      return tp;
   } else {
      for (i = cp; i > 0; i--) {
         if (i % 7 == 0) {
            return i;
         };
      };
      return 1;
   };
};


window.onload = function() {
   // Get the form element
   var form = document.getElementById("form-login");
   
   // Check if the form exists and has any input fields
   if (form && form.elements.length > 0) {
       // Focus the first input element in the form
       form.elements[0].focus();
   };
};

$('#ey1, #ey2, #ey3').click(function(){
   if ($(this).hasClass('bi-eye-slash')) {
     $(this).addClass('bi-eye');
     $(this).removeClass('bi-eye-slash');
     $(this).siblings('input').attr('type','text');
   } else {
     $(this).removeClass('bi-eye');
     $(this).addClass('bi-eye-slash');
     $(this).siblings('input').attr('type','password');
   }
});

$(':input:enabled:visible:first').focus();

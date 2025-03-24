

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
          
        }
      
        postCall("/client/book-appoinment" ,{servicename,barbername,bookdate}, function(res) {
          if (res.flag === 1) {
            userToast(1, res.msg,2000);
            setTimeout(() => {
            window.location.replace("/client/home");
            }, 2000);
          } else {
            userToast(0, res.msg,2000);
          }
        });
      });
      
  }); 
  
  
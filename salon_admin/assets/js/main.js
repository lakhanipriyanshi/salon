(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach((e) => e.addEventListener(type, listener));
    } else {
      select(el, all).addEventListener(type, listener);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  const updateFormattedUTCTime = () => {
    const currentDate = new Date();

    // Get the day, month, year, hours, minutes, seconds, and AM/PM For UTC Time
    const dayOfWeek = currentDate.toLocaleString('en-IN', { weekday: 'long' }); // Sunday, Monday, etc.
    const month = currentDate.toLocaleString('en-IN', { month: 'long' }); // December, January, etc.
    const day = currentDate.getDate(); // Day of the month
    const year = currentDate.getFullYear(); // Full year (e.g., 2024)
    let hours = currentDate.getHours(); // Hour in UTC
    const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Minutes with leading zero if needed
    const seconds = currentDate.getSeconds().toString().padStart(2, '0'); // Seconds with leading zero if needed
    const ampm = hours >= 12 ? 'PM' : 'AM'; // AM/PM indicator

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;  // the hour '0' should be '12'

    // Format the UTC time as "Day, Month Day, Year at Hour:Minute:Second AM/PM"
    const formattedUTC = `${dayOfWeek}, ${month} ${day}, ${year} at ${hours}:${minutes}:${seconds} ${ampm}`;

    // Get the user's timezone
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Display the formatted date/time and timezone in the HTML
    $('#currentTime').text(formattedUTC);
  };

  // Call the updateFormattedUTCTime function immediately to display time
  updateFormattedUTCTime();

  // Update the time every 1000ms (1 second)
  setInterval(updateFormattedUTCTime, 1000);

  /**
   * Sidebar toggle
   */
  if (select(".toggle-sidebar-btn")) {
    on("click", ".toggle-sidebar-btn", function (e) {
      select("body").classList.toggle("toggle-sidebar");
    });
  }

  /**
   * Search bar toggle
   */
  if (select(".search-bar-toggle")) {
    on("click", ".search-bar-toggle", function (e) {
      select(".search-bar").classList.toggle("search-bar-show");
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(needsValidation).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });

})();



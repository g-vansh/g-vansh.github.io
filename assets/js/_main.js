/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function(){
   // Sticky footer
  var bumpIt = function() {
      $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
    },
    didResize = false;

  bumpIt();

  $(window).resize(function() {
    didResize = true;
  });
  setInterval(function() {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);
  // FitVids init
  $("#main").fitVids();

  // init sticky sidebar
  $(".sticky").Stickyfill();

  var stickySideBar = function(){
    var show = $(".author__urls-wrapper button").length === 0 ? $(window).width() > 1024 : !$(".author__urls-wrapper button").is(":visible");
    // console.log("has button: " + $(".author__urls-wrapper button").length === 0);
    // console.log("Window Width: " + windowWidth);
    // console.log("show: " + show);
    //old code was if($(window).width() > 1024)
    if (show) {
      // fix
      Stickyfill.rebuild();
      Stickyfill.init();
      $(".author__urls").show();
    } else {
      // unfix
      Stickyfill.stop();
      $(".author__urls").hide();
    }
  };

  stickySideBar();

  $(window).resize(function(){
    stickySideBar();
  });

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're on mobile
    if ($(window).width() <= 600) {
      // Mobile: Toggle mobile dropdown overlay
      const dropdown = $(".author__urls-mobile-overlay");
      const button = $(this);
      
      if (dropdown.hasClass("is-open")) {
        // Close dropdown
        dropdown.removeClass("is-open");
        button.removeClass("open");
        $("body").removeClass("author-dropdown-open");
      } else {
        // Open dropdown
        dropdown.addClass("is-open");
        button.addClass("open");
        $("body").addClass("author-dropdown-open");
      }
    } else {
      // Desktop behavior: Toggle traditional dropdown
      $(".author__urls").fadeToggle("fast", function() {});
      $(".author__urls-wrapper button").toggleClass("open");
    }
  });

  // Close mobile dropdown when clicking outside or on overlay background
  $(document).on("click", ".author__urls-mobile-overlay.is-open", function(e) {
    if ($(e.target).hasClass("author__urls-mobile-overlay")) {
      $(".author__urls-mobile-overlay").removeClass("is-open");
      $(".author__urls-wrapper button").removeClass("open");
      $("body").removeClass("author-dropdown-open");
    }
  });

  // Close mobile dropdown when clicking a link
  $(document).on("click", ".author__urls-mobile-overlay a", function() {
    setTimeout(function() {
      $(".author__urls-mobile-overlay").removeClass("is-open");
      $(".author__urls-wrapper button").removeClass("open");
      $("body").removeClass("author-dropdown-open");
    }, 300);
  });

  // init smooth scroll
  $("a").smoothScroll({offset: -20});

  // add lightbox class to all image links
  $("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']").addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

});

(function($) {
    "use strict";

    var rideCountupStarted = false,
        originalCount = 0;

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    $('#topNav').affix({
        offset: {
            top: 200
        }
    });
    
    new WOW().init();
    
    var isScrolledIntoView = function (elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
    
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
    
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    };

    var startRideCountup = function () {
        console.log('starting ride countup');
        var counter = $('#ride-count');
        var count = parseInt(counter.text());

        if(originalCount <= count) {
            return;
        }
        
        counter.removeClass();
        counter.text(count + 1);
        counter.addClass('fadeInUp');

        setTimeout(startRideCountup, 1);
    };
    
    $('a.page-scroll').bind('click', function(event) {
        var $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });
    
    $('.navbar-collapse ul li a').click(function() {
        /* always close responsive nav after click */
        $('.navbar-toggle:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function (e) {
       $('#galleryImage').attr("src",$(e.relatedTarget).data("src"));
    });

    $(window).scroll(function () {
        var counter = $('#ride-count');
        if(isScrolledIntoView(counter) && !rideCountupStarted) {
            rideCountupStarted = true;
            startRideCountup();
        }
    });;

    var counter = $('#ride-count');
    originalCount = parseInt(counter.text());
    counter.text("0");

})(jQuery);
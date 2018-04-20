(function($) {
    "use strict";

    var rideCountupStarted = false,
        allIframesLoaded = false;

    var tnr_genesis = new Date(2015, 3, 9, 19, 30);
    // We have never missed a week since the start.
    var tnr_offset = 0;
    var ride_number = Math.ceil(((new Date() - tnr_genesis) / 86400000)/7) + tnr_offset;

    var isMobileBrowser = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    var isScrolledIntoView = function (elem, completelyInView = false) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
    
        var elemHeight = $(elem).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + elemHeight;

        var elemBelowViewTop = (elemTop >= docViewTop);
        var elemAboveViewBottom = (elemBottom <= docViewBottom);
        
        if(completelyInView) {
            return (elemAboveViewBottom && elemBelowViewTop);
        } else {
            return  ((elemBelowViewTop && (elemTop < docViewBottom)) ||
                    (elemAboveViewBottom && (elemBottom > docViewTop)) );
        }
    };

    var initEnhancements = function () {
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 60
        });

        $('#topNav').affix({
            offset: {
                top: 200
            }
        });

        // WOW
        new WOW().init();
        // Image lazyload
        var myLazyLoad = new LazyLoad();

        // Ride number count up
        var counter = $('#ride-count');
        counter.text("0");

        var tnr_date = new Date((tnr_genesis * 1) + (ride_number * 604800000))
        $('#ride-date').text(humanizeDateString(tnr_date))


        // Better full-width Google maps UX
        var hideInstructions = false;
        $('#gmaps-container').click(function(){
            $(this).find('iframe').addClass('clicked');
            $(this).removeClass('instructions');
            hideInstructions = true;
        }).mouseleave(function(){
            $(this).find('iframe').removeClass('clicked');
        }).mouseover(function(){
            if (!hideInstructions) {
                $(this).addClass('instructions');
                var container = this;
                requestTimeout(function() {
                    hideInstructions = true;
                    $(container).removeClass('instructions');
                }, 5000);
            }
        });
    };
    
    var humanizeDateString = function(date) {
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var day = date.getDate();
        var month = monthNames[date.getMonth()];
        var year = date.getFullYear();
        return month + ' ' + day + ', ' + year;
    }

    var initIframes = function () {
        var iframes = $('iframe');
    
        iframes.load(function() {
            console.log('loaded iFrame: ' + $(this).data('src'));
        });

        if(isMobileBrowser()) {
            // Change all images to small images?
            // Reduce the size of the iframes
            $('iframe').each(function(i, iframeEl){
                iframeEl.width = 320;
            });
        }    
    };

    var countUpEasing = function(t) {
        return t*(2-t);
    }

    var startRideCountup = function () {
        var counter = $('#ride-count');
        var originalCount = parseInt(counter.text());

        if(originalCount >= ride_number) {
            return;
        } else if (originalCount == NaN || originalCount == undefined) {
            originalCount = 0;
        }

        counter.removeClass();
        counter.text(originalCount + 1);
        counter.addClass('fadeInUp');

        var frameDelay = 5
        if (ride_number - originalCount <= 2) {
            frameDelay = 250;
        } else if (ride_number - originalCount < 15) {
            var percentage = Math.abs(ride_number - originalCount - 15) / 15;
            frameDelay = countUpEasing(percentage) * 100;
        }

        requestTimeout(startRideCountup, frameDelay);
    };

    var getLastThursdayDate = function(d) {
        d = d ? new Date(d) : new Date();
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -4:3); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    var resetRideInfoToDefault = function() {
        var rideInfoDate = $('#ride-info-last-updated');
        var lastThursday = getLastThursdayDate(); 
        var lastUpdatedDate = new Date(rideInfoDate.text());
      
        if (Date.parse(lastThursday ) >Date.parse(lastUpdatedDate)) {
            var feature1 = $('#ride-feature-1'),
            feature2 = $('#ride-feature-2'),
            feature3 = $('#ride-feature-3');

            feature1.find('p').text('Thursday Night Ride');

            feature2.find('i').attr('class', 'icon-lg ion-android-bicycle wow fadeInUp');
            feature2.find('h3').text('You know what to expect');
            feature2.find('p').text('There will be at least one bathroom stop and one store stop');

            feature3.find('i').attr('class', 'icon-lg ion-android-contacts wow fadeInUp');
            feature3.find('h3').text('Theme TBD');
            feature3.find('p').text('Let\'s have fun biking around town with our friends!');

        }
    }

    var initScroll = function () {
        $('a.page-scroll').bind('click', function(event) {
            var $ele = $(this);
            $('html, body').stop().animate({
                scrollTop: ($($ele.attr('href')).offset().top - 50)
            }, 1450, 'easeInOutExpo');
            event.preventDefault();
        });
        
        $('.navbar-collapse ul li a').click(function() {
            /* always close responsive nav after click */
            $('.navbar-toggle:visible').click();
        });

        $('#galleryModal').on('show.bs.modal', function (e) {
            $('#galleryImage').attr("src",$(e.relatedTarget).data("src"));
            $('#galleryModal .credit').text($(e.relatedTarget).data("credit"));
        });

        $(window).scroll(function () {
            var counter = $('#ride-count');
            if(isScrolledIntoView(counter, true) && !rideCountupStarted) {
                rideCountupStarted = true;
                startRideCountup();
            }

            var iframes = $('iframe');
            allIframesLoaded = true;
            iframes.each(function(index, iframe){
                if(isScrolledIntoView(iframe) == true &&
                    typeof $(iframe).attr('loaded') ==  'undefined') {
                    allIframesLoaded = false;
                    $(iframe).attr('src', function() {
                        $(this).attr('loaded', true);
                        return $(this).data('src');
                    });
                }
            });
        });;
    };

    initIframes();
    initEnhancements();
    initScroll();
    resetRideInfoToDefault();

})(jQuery);

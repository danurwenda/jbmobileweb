
Modernizr.addTest('iphone-safari', function () {
    var deviceAgent = navigator.userAgent.toLowerCase(),
            agentID = deviceAgent.match(/(iphone|ipod|ipad)/),
            isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    if (agentID && isSafari) {
        return true;
    }
});

function debounce(func, wait, immediate) {
// utility to trigger events after set time (used on scroll principally)
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        }, wait);
        if (immediate && !timeout) {
            func.apply(context, args);
        }
    };
}

$(function () {
// FACEBOOK

    function popupFB() {
        FB.login(function (response) {
            statusChangeCallback(response)
        }, {scope: 'public_profile,email'});
    }
    $('.btn-fb').click(popupFB)
    function testAPI() {
        FB.api('/me?fields=email,first_name,name', function (response) {

            console.log(response);
            // (try to) registering user
            var d = "http://mobile.jbatik.com/back/index.php/register/register";
            $.post(d, {
                email: response.email,
                name: response.name
            }, function (res) {
                if ($.parseJSON(res).status === 'registered') {
                    // show proper message
                    $('#regname').html(response.first_name)
                    $('#registered-container').removeClass('hidden')
                    $('#signup-container').addClass('hidden')
                    $('button.btn-fb').addClass('hidden')
                }
            })
        });
    }
    // This is called with the results from from FB.getLoginStatus().
    function statusChangeCallback(response) {
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {

            // Logged into your app and Facebook.
            testAPI();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.

        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.

        }
    }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.

    window.fbAsyncInit = function () {
        FB.init({
            appId: '1111388688958576',
            xfbml: true,
            version: 'v2.6'
        });

        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });

    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

// END OF FACEBOOK
    var
            $body = $('body'),
            videoEle,
            $videoBgSelector = $('#bg-video'),
            videoBgEle = $videoBgSelector.get(0),
            $header = $('.header'),
            $modalVideo = $('.modal-video'),
            $fadeControls = $('.modal-video .fade-control'),
            $launchButton = $('.btn-launch-video'),
            $hasHint = $('.has-hint'),
            $hero = $('.level-hero'),
            controlsTimer = null,
            eventLastX = 0,
            eventLastY = 0,
            desktopView = Modernizr.mq("screen and ( min-width: 1200px )"),
            canPlaceholder = Modernizr.input.placeholder;
    baseUrl = window.location.hostname;
//video modal
$('.launch-modal').on('click', function(e){
    e.preventDefault();
    $( '#' + $(this).data('modal-id') ).modal();
});
//end of video modal


    if (Modernizr.video && desktopView && videoBgEle) {
        videoBgEle.load();
        videoBgEle.play();

        if (typeof videoBgEle.loop == 'boolean') {
            // loop supported
            videoBgEle.loop = true;
        } else {
            // loop property not supported
            videoBgEle.on('ended', function () {
                this.currentTime = 0;
                this.play();
            },
                    false);
        }

    } else {
        $videoBgSelector.remove();
    }

    var checkModal = function () {
        return $modalVideo.hasClass('active');
    };

    $(document).on('keydown.od47', function (e) {

        if (checkModal()) {
            var target = $modalVideo.find('video');
            switch (e.which) {

                case 27:
                    clearVideo();
                    e.preventDefault();
                    break;
                case 32:
                    togglePlayPause(target);
                    e.preventDefault();
                    break;
                default:
                    return;

            }
            // e.preventDefault();
        }
    });

    var clearVideo = function () {
        // close modal video
        var videoEle = $modalVideo.find('video').get(0);
        $body.removeClass('modal-open');
        $modalVideo.removeClass('playing').removeClass('active');

        videoEle.pause();
        if ($videoBgSelector.length) {
            videoBgEle.play();
        }

        controlsTimer = null;

        setTimeout(function () {
            if (videoEle.readyState !== 0) {
                videoEle.currentTime = 0;
            }
        }, 500);

    };

    var launchVideo = function (target) {
        $body.addClass('modal-open');
        $modalVideo.addClass('active').append('<i class="icon loading-icon"></i>');
        var videoEle = $('#' + target).find('video').get(0);
        videoEle.load();
        // autotrigger play hack iOS (ipad)
        videoEle.play();
        videoEle.pause();

        $fadeControls.addClass('on');
        beginFadeTimer(5000);


        setTimeout(function () {

            videoEle.classList ? videoEle.classList.add('playing') : videoEle.className += ' playing';

            if (videoBgEle && !videoBgEle.paused) {
                videoBgEle.pause();
            }
            videoEle.play();
            $('.loading-icon').remove();

            videoEle.addEventListener('webkitendfullscreen', function () {
                // clearVideo( videoEle );
                clearVideo();
            }, false);

            videoEle.addEventListener('ended', function () {
                clearVideo();
            }, false);

        }, 1000);
    };

    // launch popup
    $launchButton.on('click', function (e) {
        if (Modernizr.video) {
            var target = $(this).data('videomodal');
            launchVideo(target);
            e.preventDefault();
        }

    });

    var togglePlayPause = function (trigger) {
        var videoEle = trigger.get(0);
        // If the mediaPlayer is currently paused or has ended
        if (videoEle.paused || videoEle.ended) {
            videoEle.play();

        }
        // Otherwise it must currently be playing?
        else {
            videoEle.pause();
        }
    };

    $modalVideo.find('video').on('click', function (e) {
        var $this = $(this);
        togglePlayPause($this);
    });

    $('.close-modal').on('click', function (e) {
        // var videoModal = $(this).closest('.modal-video');
        clearVideo();
    });

    // timer fadeout on controls
    var beginFadeTimer = function (duration) {
        $fadeControls.addClass('on');
        if (!duration) {
            duration = 4000;
        }
        if (controlsTimer) {
            clearTimeout(controlsTimer);
            controlsTimer = null;
        }
        controlsTimer = setTimeout(fadeControlsOut, duration);
    };

    var fadeControlsOut = function () {
        $fadeControls.removeClass('on');
    };


    $modalVideo.add($fadeControls).on('mousemove touchmove', function (e) {
        // click / touch restarts timer
        if (eventLastX !== e.clientX || eventLastY !== e.clientY) {

            beginFadeTimer(4000);
        }
        eventLastX = e.pageX;
        eventLastY = e.pageY;
    }).on('click', function (e) {
        beginFadeTimer(4000);
    });

    // hint arrows
    var levelHandler = function () {

        var st = $(window).scrollTop(),
                wh = $(window).height(),
                hh = $hero.outerHeight(true),
                headerh = $header.outerHeight(true);

        if ($hasHint.length) {

            if (wh > (hh + headerh)) {
                $hasHint.removeClass('active-state');
            } else {

                if (st <= 50) {
                    $hasHint.addClass('active-state');
                } else {
                    $hasHint.removeClass('active-state');
                }
            }
        }

    };

    // run on doc ready
    levelHandler();

    var scrollTrigger = debounce(function () {
        // re-run on scroll :)
        levelHandler();
    }, 1);
    // doesnt play well to debounce this

    if (canPlaceholder) {
        // switched. ie test
        $('label').addClass('sr-only');
    }

    // "retry" form 
    $(document).on('click', '.reload-form', function (e) {
        e.preventDefault();
        $(this).closest('.success').removeClass('active').prev().removeClass('hide');
    });

    // bootstrap dropdown 

    $(document).on('click', '.dropdown-menu li', function (e) {
        var $t = $(this),
                $parent = $t.parent(),
                optVal = $(this).data('value'),
                placeholder = $(this).data('placeholder'),
                displayTarget = $parent.data('displaytarget'),
                inputTarget = $parent.data('inputtarget'),
                $inputTarget = $(inputTarget);
        $t.addClass('disabled').siblings().removeClass('disabled');
        $(displayTarget).text(placeholder);
        if (inputTarget) {
            $inputTarget.find('option[value="' + optVal + '"]').attr('selected', 'selected').siblings().removeAttr('selected');
        }
    });

    // bootstrap modal hack - click detection to see if click is within modal or not 
    // this css: http://jsfiddle.net/sRmLV/22/
    $('.modal-valign-helper').on('click', function (e) {
        var target = $(e.target);
        if (target.is('.modal-dialog')) {
            $('.modal').modal('hide');
        }

        // e.preventDefault();
    });

    // external links in new window 
    $('a[href^="http:"]').not('[href*="' + baseUrl + '"]').addClass('external').attr({target: "_blank"});

    if (window.location.hash && $('.is-section-archived').length) {
        var eleID = window.location.hash.split('#');
        $('[aria-controls="' + eleID[1] + '"]').hide();
    }

    if (window.history && window.history.pushState) {

        $('.show-section').on('click', function (e) {
            e.preventDefault();

            var $t = $(this),
                    anchor = $t.attr('href'),
                    offset = $(anchor).offset();

            $t.hide();
            history.pushState({}, "", anchor);
            $(anchor).addClass('is-archive-visible');
            $('body,html').animate({scrollTop: (offset.top) - 50}, 500);
        });

    }



    // util - needed ?
    $(window).on('load', function () {
        $body.addClass('loaded');
    });

    $(window).on('resize scroll', scrollTrigger);

    // scroll to next level clicking on hint arrow - cheap!
    $('.hint-arrow').on('click', function (e) {
        var $parentLevel = $(this).closest('.level');

        if (!$parentLevel.length) {
            $parentLevel = $('.level-hero');
        }

        var $nextLevel = $parentLevel.next('.level'),
                target = $nextLevel.offset(),
                target = target.top;
        if ($nextLevel) {
            $('body,html').animate({scrollTop: target}, 700, "linear");
        }
    });

    // scroll to next level - this should be merged with previous function
    $('.btn-scroll').on('click', function (e) {
        var href = $(this).attr('href');

        if (href.length) {
            var $target = $(href);
        }

        var target = $target.offset(),
                target = target.top;
        $('body,html').animate({scrollTop: target}, 700, "linear");

        e.preventDefault();

    });

    // colophon date 
    var d = new Date(),
            dateText = d.getFullYear();
    $('#date-year').text(dateText);

    // LAUNCH VIDEO VIA DIRECT URL
    var getHash = location.hash;

    if (getHash === "#video" || getHash === "video") {
        var videoID = $launchButton.data('videomodal');
        launchVideo(videoID);
    }

    // TABBED CONTENT

    $tabList = $('.inline-tabs');

    function measureTabs() {

        $tabList.each(function (e) {

            var $t = $(this),
                    $listItems = $t.find('li'),
                    totalWidth = 0,
                    $parent = $t.closest('.inline-tabs-wrapper'),
                    ww = window.innerWidth;

            $listItems.each(function () {
                var $li = $(this);
                totalWidth += $li.outerWidth(true);

                // console.log( $li.offset() );
            });

            console.log(totalWidth);

            if (totalWidth + 30 > ww) {
                $parent.addClass('active-nav');
                $t.width(totalWidth);

            } else {
                $parent.removeClass('active-nav');
                $t.removeAttr('style');
            }

        });


    }

    var resizeTabs = debounce(function () {

        measureTabs();
    }, 50);

    $(window).on('load resize', function () {
        resizeTabs();
    });

    function prevNextTabs(e, $t) {
        e.preventDefault();

        var
                $target = $t.parent(),
                $wrapper = $target.find('.inline-tabs-list-wrapper'),
                $scroller = $wrapper.find('.inline-tabs'),
                $listItems = $target.find('li'),
                $firstInView = $target.find('.first-in-view'),
                distance,
                animSpeed = 400,
                currentScroll = $wrapper.scrollLeft();

        // can click, will click
        if (!$t.hasClass('disabled')) {

            if ($t.hasClass('btn-prev')) {

                if ($firstInView.prev().length) {

                    $firstInView.removeClass('first-in-view').prev().addClass('first-in-view');

                }

                distance = $firstInView.outerWidth();

                $wrapper.animate({scrollLeft: (currentScroll - distance)}, animSpeed, function () {

                    $target.find('.btn-next').removeClass('disabled');

                    var scrollLeft = $wrapper.scrollLeft();

                    if (scrollLeft <= 0) {
                        $t.addClass('disabled');
                    }
                });



            } else {

                // switch class to next item if we cab

                if ($firstInView.next().length) {

                    $firstInView.removeClass('first-in-view').next().addClass('first-in-view');

                }

                distance = $firstInView.outerWidth();

                $wrapper.animate({scrollLeft: (distance + currentScroll)}, animSpeed, function () {

                    $target.find('.btn-prev').removeClass('disabled');
                    var scrollLeft = $wrapper.scrollLeft();


                    // alert ( "scroll left:" + scrollLeft + " width of scroller: " + $scroller.width() + " width of wrapper: " + $wrapper.width() );


                    if (($wrapper.width() + scrollLeft) >= $scroller.width()) {
                        $t.addClass('disabled');
                    }
                });

            }



        }

    }

    $('.inline-tabs-nav').on('click', function (e) {

        prevNextTabs(e, $(this));

    });

    var $tabs = $('.inline-tabs a');
    $tabs.on('click', function (e) {

        var $this = $(this),
                h = $this.attr('href'),
                $parent = $this.closest('.inline-tabs'),
                $li = $parent.find('li'),
                $target = $(h);

        $li.removeClass('active');
        $this.parent().addClass('active');

        $target.addClass('active').siblings().removeClass('active');

        e.preventDefault();
    });
    //video
    

    //bilingual
    function translate() {
        $("[data-translate]").each(function () {
            var a = $(this).data("translate");
            $(this).html(dictionary[a][current_lang] || "N/A")
        })
    }
    var dictionary = {
        subheading: {
            id: "Aplikasi mendesain batik dengan mudah dan menyenangkan.",
            en: "App to design batik in fun and easy way "
        },
        tonton: {
            id: "Tonton Video",
            en: "Watch Video"
        },
        intro: {
            id: "Memperkenalkan<br/> jBatik Mobile",
            en: "Introducing<br/> jBatik Mobile"
        },
        intro1: {
            id: "Aplikasi untuk membuat Batik.",
            en: "An application to create Batik."
        },
        intro2: {
            id: "Kini di genggamanmu.",
            en: "Now is in your hand."
        },
        feat1: {
            id: "Mendesain batik",
            en: "An application to create Batik."
        },
        feat11: {
            id: "Ada 2000 perajin yg menggunakan jbatik di indonesia.",
            en: "2,000 batik artisans in Indonesia are using jBatik."
        },
        feat2: {
            id: "Tampilkan di media sosial",
            en: "Share on social media."
        },
        feat21: {
            id: "Bagikan motif batik kamu melalui media sosial (Facebook, Twitter, Pinterest dan Instagram) dan layanan chat Whatsapp dan Line.",
            en: "Share your batik pattern through social media, Whatsapp and LINE."
        },
        feat3: {
            id: "Aplikasi untuk Tablet dan Handphone",
            en: "An application for your tablet and handphone."
        },
        feat31: {
            id: "Jbatik mobile tersedia untuk tablet dan handphone berbasis ANDROID.",
            en: "JBatik mobile is available for your android tablet and phone."
        },
        feat4: {
            id: "Gratis",
            en: "Free."
        },
        feat41: {
            id: "Aplikasi ini gratis!",
            en: "Absolutely free."
        },
        signup: {
            id: "Daftar sekarang",
            en: "Register now"
        },
        signup2: {
            id: "Aplikasi ini dalam proses penyelesaian. Kami akan memberitahu kamu saat sudah jadi.",
            en: "The apps is in the making. We'll let you know when it's ready."
        },
        registered: {
            id: "Terima kasih telah mendaftar, ",
            en: "Thanks for registering, "
        },
        fb: {
            id: "Daftar dengan Facebook",
            en: "Register using Facebook"
        },
    }
    var current_lang = "id";
    $(document).on("click", "[data-lang]", function () {
        current_lang = $(this).data("lang")
        translate()
    })
    translate()

});
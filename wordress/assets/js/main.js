$(function () {

    // --- Header & Sidebar Logic ---
    var $header = $('#header');
    var $hamburger = $('#hamburger');
    var $mobileSidebar = $('#mobileSidebar');
    var $closeSidebar = $('#closeSidebar');
    var $sidebarOverlay = $('#sidebarOverlay');

    // Scroll / resize → toggle .scrolled class
    if ($header.length) {
        var updateHeaderState = function () {
            var scrollTop = $(window).scrollTop();
            var isScrolled = scrollTop > 150 || $(window).width() < 1024;
            $header.toggleClass('scrolled', isScrolled);

            if (isScrolled && window.matchMedia('(min-width: 992px)').matches
                && $mobileSidebar.hasClass('active')) {
                $mobileSidebar.removeClass('active');
                $hamburger.removeClass('active');
            }
        };
        $(window).on('scroll resize', updateHeaderState);
        updateHeaderState();

        // Hide header when footer enters viewport (desktop only)
        var footer = document.querySelector('footer.footerWrap');
        if (footer && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                if (window.matchMedia('(min-width: 992px)').matches) {
                    $header.toggleClass('hidden-at-footer', entries[0].isIntersecting);
                } else {
                    $header.removeClass('hidden-at-footer');
                }
            }, { threshold: 0.6 });
            observer.observe(footer);
        }
    }

    // Mobile menu toggle
    if ($hamburger.length && $mobileSidebar.length && $closeSidebar.length && $sidebarOverlay.length) {
        var toggleMenu = function (show) {
            var action = show ? 'addClass' : 'removeClass';
            $mobileSidebar[action]('active');
            $hamburger[action]('active');
        };

        $hamburger.on('click', function () { toggleMenu(true); });
        $closeSidebar.on('click', function () { toggleMenu(false); });
        $sidebarOverlay.on('click', function () { toggleMenu(false); });
    }

    // Apply matchHeight BEFORE AOS.init() — at this point elements are still
    // at their natural height (AOS hasn't hidden them yet), so measurement is accurate.
    function applyMatchHeight() {
        $('.blogItem h5').matchHeight();
        $('.blogItem > p').matchHeight();
    }

    applyMatchHeight();

    // Init AOS animations after measuring
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'slide' });
    }

    // Re-run as fallbacks in case anything shifted after AOS kicked in
    setTimeout(function () { $.fn.matchHeight._update(); }, 500);
    setTimeout(function () { $.fn.matchHeight._update(); }, 1200);

    // Re-update on each AOS scroll reveal
    document.addEventListener('aos:in', function () {
        $.fn.matchHeight._update();
    });

});


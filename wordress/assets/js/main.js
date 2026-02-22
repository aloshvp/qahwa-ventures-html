/**
 * Component Loader — loads header.html & footer.html into their placeholders
 * Runs immediately (before jQuery ready) using native fetch()
 */
(function () {
    'use strict';

    function loadComponent(placeholderId, componentPath, callback) {
        var el = document.getElementById(placeholderId);
        if (!el) return;

        fetch(componentPath)
            .then(function (res) {
                if (!res.ok) throw new Error('Failed to load: ' + componentPath);
                return res.text();
            })
            .then(function (html) {
                el.outerHTML = html;
                if (typeof callback === 'function') callback();
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    // Use the page's own URL as the base — always the wordress/ root
    var base = document.baseURI.substring(0, document.baseURI.lastIndexOf('/') + 1);

    // Load header → once injected, init header JS (hamburger / scroll logic)
    loadComponent('header-placeholder', base + 'components/header.html', function () {
        initHeaderJS();
        document.dispatchEvent(new Event('headerLoaded'));
    });

    // Load footer
    loadComponent('footer-placeholder', base + 'components/footer.html', function () {
        document.dispatchEvent(new Event('footerLoaded'));
    });

    // Header JS logic (mirrors assets/js/header.js)
    function initHeaderJS() {
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

            // Hide header when footer enters viewport using IntersectionObserver
            function observeFooter() {
                var footer = document.querySelector('footer.footerWrap');
                if (footer && 'IntersectionObserver' in window) {
                    var observer = new IntersectionObserver(function (entries) {
                        $header.toggleClass('hidden-at-footer', entries[0].isIntersecting);
                    }, { threshold: 0 });
                    observer.observe(footer);
                }
            }

            // Try immediately (in case footer already loaded), also after footerLoaded
            observeFooter();
            document.addEventListener('footerLoaded', observeFooter);
        }

        // Mobile menu toggle
        if ($hamburger.length && $mobileSidebar.length && $closeSidebar.length && $sidebarOverlay.length) {
            var toggleMenu = function (show) {
                var action = show ? 'addClass' : 'removeClass';
                $mobileSidebar[action]('active');
                $hamburger[action]('active');
            };

            $hamburger.off('click').on('click', function () { toggleMenu(true); });
            $closeSidebar.off('click').on('click', function () { toggleMenu(false); });
            $sidebarOverlay.off('click').on('click', function () { toggleMenu(false); });
        }
    }
})();

$(function () {
    // Init AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'slide' });
    }
    // MatchHeight for blog posts (same as parent index)
    $('.blogItem > p').matchHeight();
});

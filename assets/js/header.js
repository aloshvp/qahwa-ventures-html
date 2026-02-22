$(function () {
    // --- Header Logic ---
    const $header = $("#header");
    const $hamburger = $('#hamburger');
    const $mobileSidebar = $('#mobileSidebar');
    const $closeSidebar = $('#closeSidebar');
    const $sidebarOverlay = $('#sidebarOverlay');

    // Scroll Logic
    if ($header.length) {
        const updateHeaderState = () => {
            const isScrolled = $(window).scrollTop() > 150 || $(window).width() < 1024;
            $header.toggleClass("scrolled", isScrolled);

            if (isScrolled && window.matchMedia("(min-width: 992px)").matches && $mobileSidebar.hasClass('active')) {
                $mobileSidebar.removeClass('active');
                $hamburger.removeClass('active');
            }
        };

        $(window).on("scroll resize", updateHeaderState);
        // Initial check
        updateHeaderState();

        // Hide header when footer enters viewport
        // Footer is loaded async via fetch — use MutationObserver to wait for it
        function setupFooterObserver() {
            var footer = document.querySelector('footer.footerWrap');
            if (footer && 'IntersectionObserver' in window) {
                var intersectionObserver = new IntersectionObserver(
                    function (entries) {
                        $header.toggleClass('hidden-at-footer', entries[0].isIntersecting);
                    },
                    { threshold: 0 }
                );
                intersectionObserver.observe(footer);
                return true;
            }
            return false;
        }

        // Try immediately (works if footer is already in DOM)
        if (!setupFooterObserver()) {
            // Footer not yet injected — watch for it
            var domWatcher = new MutationObserver(function (mutations, obs) {
                if (setupFooterObserver()) {
                    obs.disconnect();
                }
            });
            domWatcher.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Mobile Menu Logic
    if ($hamburger.length && $mobileSidebar.length && $closeSidebar.length && $sidebarOverlay.length) {
        const toggleMenu = (show) => {
            const action = show ? 'addClass' : 'removeClass';
            $mobileSidebar[action]('active');
            $hamburger[action]('active');
        };

        $hamburger.on('click', () => toggleMenu(true));
        $closeSidebar.on('click', () => toggleMenu(false));
        $sidebarOverlay.on('click', () => toggleMenu(false));
    }
});

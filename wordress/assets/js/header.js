$(function () {
    // --- Header Logic ---
    const $header = $("#header");
    const $hamburger = $('#hamburger');
    const $mobileSidebar = $('#mobileSidebar');
    const $closeSidebar = $('#closeSidebar');
    const $sidebarOverlay = $('#sidebarOverlay');

    // Scroll Logic
    if ($header.length) {
        const $footer = $('footer.footerWrap');

        const updateHeaderState = () => {
            const scrollTop = $(window).scrollTop();
            const winHeight = $(window).height();
            const isScrolled = scrollTop > 150 || $(window).width() < 1024;
            $header.toggleClass("scrolled", isScrolled);

            if (isScrolled && window.matchMedia("(min-width: 992px)").matches && $mobileSidebar.hasClass('active')) {
                $mobileSidebar.removeClass('active');
                $hamburger.removeClass('active');
            }

            // Hide header when footer enters the viewport
            if ($footer.length) {
                const footerTop = $footer.offset().top;
                const isAtFooter = scrollTop >= footerTop;
                $header.toggleClass('hidden-at-footer', isAtFooter);
            }
        };

        $(window).on("scroll resize", updateHeaderState);
        // Initial check
        updateHeaderState();
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

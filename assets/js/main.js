document.addEventListener("DOMContentLoaded", () => {


    // Init AOS
    AOS.init({ duration: 800, easing: 'slide', once: true });

    // Init Swiper
    new Swiper(".bannerSwiper", {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true
    });

    // Helper to load components
    const loadComponent = (id, path, callback) => {
        const element = document.getElementById(id);
        if (element) {
            fetch(path)
                .then(res => res.text())
                .then(html => {
                    element.innerHTML = html;
                    if (callback) callback();
                })
                .catch(err => console.error(`Error loading ${path}:`, err));
        }
    };

    loadComponent("header-placeholder", "components/header.html", initializeHeader);
    loadComponent("footer-placeholder", "components/footer.html");
});

function initializeHeader() {
    // Scroll Logic
    const header = document.getElementById("header");
    if (header) {
        window.addEventListener("scroll", () =>
            header.classList.toggle("scrolled", window.scrollY > 50)
        );
    }

    // Mobile Menu Logic
    const ids = ['hamburger', 'mobileSidebar', 'closeSidebar', 'sidebarOverlay'];
    const elements = ids.reduce((acc, id) => ({ ...acc, [id]: document.getElementById(id) }), {});

    if (Object.values(elements).every(el => el)) {
        const toggleMenu = (show) => {
            const action = show ? 'add' : 'remove';
            elements.mobileSidebar.classList[action]('active');
            elements.hamburger.classList[action]('active');
        };

        elements.hamburger.addEventListener('click', () => toggleMenu(true));
        elements.closeSidebar.addEventListener('click', () => toggleMenu(false));
        elements.sidebarOverlay.addEventListener('click', () => toggleMenu(false));
    }
}

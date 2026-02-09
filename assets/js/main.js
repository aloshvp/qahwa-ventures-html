document.addEventListener("DOMContentLoaded", () => {


    // Init AOS
    // AOS.init({ duration: 800, easing: 'slide', once: true });
    AOS.init({ duration: 800, easing: 'slide' });

    // Init Swiper
    if (typeof Swiper !== 'undefined') {
        new Swiper(".bannerSwiper", {
            pagination: { el: ".swiper-pagination", clickable: true },
            loop: true,
            effect: "fade"
        });

        // Product Swiper
        const productSwiper = new Swiper('.productSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            effect: "fade",
            autoplay: {
                delay: 8000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                prevEl: '.productSwiperPrevBtn',
                nextEl: '.productSwiperNextBtn'
            }
        });
    }

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

    // Initialize Header directly since it's now inlined
    initializeHeader();

    // Header loading removed
    loadComponent("footer-placeholder", "components/footer.html");
});

function initializeHeader() {
    // Scroll Logic
    const header = document.getElementById("header");
    if (header) {
        const updateHeaderState = () => {
            header.classList.toggle("scrolled", window.scrollY > 150 || window.innerWidth < 1024);
        };

        window.addEventListener("scroll", updateHeaderState);
        window.addEventListener("resize", updateHeaderState);

        // Initial check
        updateHeaderState();
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

// Contact Form Validation
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const requiredFields = ['name', 'phone', 'email', 'subject'];

        // Input listener to clear errors
        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', function () {
                    // Restrict phone to numbers only
                    if (id === 'phone') {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    }

                    const parent = this.closest('.contactFormGridItem');
                    const errorMsg = parent.querySelector('.error-msg');
                    if (parent.classList.contains('error')) {
                        parent.classList.remove('error');
                        if (errorMsg) errorMsg.textContent = '';
                    }
                });

                // Validate email on blur
                if (id === 'email') {
                    input.addEventListener('blur', function () {
                        const parent = this.closest('.contactFormGridItem');
                        const errorMsg = parent.querySelector('.error-msg');
                        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                        if (this.value.trim() && !emailPattern.test(this.value.trim())) {
                            parent.classList.add('error');
                            if (errorMsg) errorMsg.textContent = 'Please enter a valid email';
                        }
                    });
                }
            }
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            let firstErrorInput = null;

            requiredFields.forEach(id => {
                const input = document.getElementById(id);
                const parent = input.closest('.contactFormGridItem');
                let errorMsg = parent.querySelector('.error-msg');
                let fieldValid = true;

                // Create error msg if not exists (fallback)
                if (!errorMsg) {
                    errorMsg = document.createElement('span');
                    errorMsg.className = 'error-msg';
                    parent.appendChild(errorMsg);
                }

                if (!input.value.trim()) {
                    fieldValid = false;
                    parent.classList.add('error');
                    errorMsg.textContent = 'This field is required';
                } else if (id === 'email') {
                    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailPattern.test(input.value.trim())) {
                        fieldValid = false;
                        parent.classList.add('error');
                        errorMsg.textContent = 'Please enter a valid email';
                    }
                } else if (id === 'phone') {
                    // Allow digits, spaces, plus, minus, parentheses. Minimum 7 chars.
                    const phonePattern = /^[0-9+\-\s()]*$/;
                    const phoneVal = input.value.trim();
                    if (!phonePattern.test(phoneVal) || phoneVal.replace(/[^0-9]/g, '').length < 7) {
                        fieldValid = false;
                        parent.classList.add('error');
                        errorMsg.textContent = 'Please enter a valid phone number';
                    }
                }

                if (!fieldValid) {
                    isValid = false;
                    if (!firstErrorInput) {
                        firstErrorInput = input;
                    }
                }
            });

            if (isValid) {
                alert('Form submitted successfully!');
                contactForm.reset();
                document.querySelectorAll('.contactFormGridItem.error').forEach(el => el.classList.remove('error'));
            } else if (firstErrorInput) {
                firstErrorInput.focus();
            }
        });
    }
});

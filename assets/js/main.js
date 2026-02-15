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
    // Product Filtering Logic
    const productsGrid = document.querySelector('.productsGrid');
    if (productsGrid) {
        const productsData = [
            {
                id: 1,
                category: 'whole-beans',
                image: 'assets/images/products/bio_500g.png',
                title: 'Biologica',
                subtitle: 'Organic Coffee Beans',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 2,
                category: 'whole-beans',
                image: 'assets/images/products/cremoso_grani_1kg_3-4_dx.png',
                title: 'Cremoso',
                subtitle: 'Organic Coffee Beans',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 3,
                category: 'compatible-capsules',
                image: 'assets/images/products/top_originale_lattina_250.png',
                title: 'Originale',
                subtitle: 'Organic Coffee Beans',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 4,
                category: 'espresso-line',
                image: 'assets/images/products/Espresso-Bar.png',
                title: 'Espresso Bar',
                subtitle: 'Organic Coffee Beans',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 5,
                category: 'compatible-capsules',
                image: 'assets/images/products/gran_aroma_grani_1Kg.png',
                title: 'Gran Aroma',
                subtitle: 'Organic Coffee Beans',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 6,
                category: 'moka-line',
                image: 'assets/images/products/decaffe_capsule_10.png',
                title: 'Decaffe',
                subtitle: 'Organic Coffee Beans',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
        ];

        const renderProducts = (filter) => {
            productsGrid.innerHTML = '';
            const filteredProducts = filter === 'all'
                ? productsData
                : productsData.filter(product => product.category === filter);

            filteredProducts.forEach((product, index) => {
                const aosDelay = index * 100; // Staggered delay
                const productHTML = `
                    <div class="productsGridItem" data-aos="fade-up" data-aos-delay="${aosDelay}">
                        <div class="productsGridItemImage">
                            <img src="${product.image}" alt="${product.title}" width="308" height="231" class="productImage1" />
                            <a href="javascript://" class="productsGridItemImageOverlay">
                            <div class="productsGridItemImageOverlayDescription">                                
                                <p>${product.description1}</p>  
                                <p>${product.description2}</p>   
                                </div>  
                                <div class='productsGridItemImageOverlayEnquiry'>           
                                <img src="assets/images/products/whatsapp.png" alt="whatsapp" width="17" height="17" />
                                Enquiry by Whatsapp
                                </div>                                
                            </a>
                        </div>
                        <div class="productsGridItemContent">
                            <p>${product.title}</p>
                            <span>${product.subtitle}</span>
                        </div>
                    </div>
                `;
                productsGrid.innerHTML += productHTML;
            });

            // Refresh AOS to detect new elements
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        };

        // Initial Render
        renderProducts('all');

        // Filter Event Listeners
        const filterLinks = document.querySelectorAll('.productsMenu ul li a');
        const productsMenuTrigger = document.querySelector('.productsMenuTrigger');
        const productsMenu = document.querySelector('.productsMenu');

        if (productsMenuTrigger) {
            productsMenuTrigger.addEventListener('click', () => {
                productsMenu.classList.toggle('open');
            });

            // Set initial text
            const activeLink = document.querySelector('.productsMenu ul li a.active');
            if (activeLink) {
                productsMenuTrigger.textContent = activeLink.textContent;
            }
        }

        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all
                filterLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked
                link.classList.add('active');

                // For mobile: update trigger text and close dropdown
                if (productsMenuTrigger && window.innerWidth <= 991) {
                    productsMenuTrigger.textContent = link.textContent;
                    productsMenu.classList.remove('open');
                }

                // Render with filter
                const filter = link.getAttribute('data-filter');
                renderProducts(filter);
            });
        });
    }
});

// Expertise Smooth Scroll Logic

// Expertise Smooth Scroll Logic
const initExpertiseSmoothScroll = () => {
    // Select all links with the class 'expertiseLink'
    const expertiseLinks = document.querySelectorAll('.expertiseLink');
    if (expertiseLinks.length > 0) {
        expertiseLinks.forEach(link => {
            // Remove existing listener to prevent duplicates (though basic addEventListener doesn't dedup anonymous functions, this architecture relies on re-running for new elements)
            // Ideally we'd valid if attached, but for now we just attach. 
            // Better approach: Delegated event listener at document level.
        });
    }
};

// Delegated Event Listener for Expertise Links (Handles static and dynamic content)
document.addEventListener('click', (e) => {
    const link = e.target.closest('.expertiseLink');
    if (link) {
        e.preventDefault();

        // Check if the current page is about-us.html
        if (window.location.pathname.includes('about-us.html') || document.getElementById('our-expertise')) {
            const targetSection = document.getElementById('our-expertise');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Update URL hash without page reload
                history.pushState(null, null, '#our-expertise');
            }
        } else {
            // Navigate to about-us.html with hash
            window.location.href = 'about-us.html#our-expertise';
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Handle initial load with hash
    if (window.location.hash === '#our-expertise') {
        const checkAndScroll = () => {
            const section = document.getElementById('our-expertise');
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth' });
                }, 300); // Slight delay for rendering
            }
        };

        // Check immediately and also after delay to be safe
        checkAndScroll();
        setTimeout(checkAndScroll, 800);
    }
});

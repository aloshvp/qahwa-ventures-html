// Init AOS
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

// Main Entry Point
$(function () {

    // Helper to load components via fetch (better for local files) + jQuery
    const loadComponent = (id, path, callback) => {
        const $element = $('#' + id);
        if ($element.length) {
            fetch(path)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(html => {
                    $element.html(html);
                    if (callback) callback();
                })
                .catch(error => console.error('Error loading component:', error));
        }
    };

    // Initialize Header directly since it's now inlined
    initializeHeader();

    // Load Footer
    loadComponent("footer-placeholder", "components/footer.html");


    // --- Header Logic ---
    function initializeHeader() {
        // Scroll Logic
        const $header = $("#header");
        if ($header.length) {
            const updateHeaderState = () => {
                $header.toggleClass("scrolled", $(window).scrollTop() > 150 || $(window).width() < 1024);
            };

            $(window).on("scroll resize", updateHeaderState);
            // Initial check
            updateHeaderState();
        }

        // Mobile Menu Logic
        const $hamburger = $('#hamburger');
        const $mobileSidebar = $('#mobileSidebar');
        const $closeSidebar = $('#closeSidebar');
        const $sidebarOverlay = $('#sidebarOverlay');

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
    }


    // --- Contact Form Logic ---
    const $contactForm = $('#contactForm');
    if ($contactForm.length) {
        const requiredFields = ['name', 'phone', 'email', 'subject'];

        // Input listener to clear errors
        $.each(requiredFields, function (index, id) {
            const $input = $('#' + id);
            if ($input.length) {
                $input.on('input', function () {
                    // Restrict phone to numbers only
                    if (id === 'phone') {
                        // Limit to 10 digits
                        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
                    }

                    const $parent = $(this).closest('.contactFormGridItem');
                    const $errorMsg = $parent.find('.error-msg');

                    if ($parent.hasClass('error')) {
                        $parent.removeClass('error');
                        $errorMsg.text('');
                    }
                });

                // Validate email on blur
                if (id === 'email') {
                    $input.on('blur', function () {
                        const $parent = $(this).closest('.contactFormGridItem');
                        const $errorMsg = $parent.find('.error-msg');
                        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                        if (this.value.trim() && !emailPattern.test(this.value.trim())) {
                            $parent.addClass('error');
                            $errorMsg.text('Please enter a valid email');
                        }
                    });
                }
            }
        });

        $contactForm.on('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            let $firstErrorInput = null;

            $.each(requiredFields, function (index, id) {
                const $input = $('#' + id);
                const $parent = $input.closest('.contactFormGridItem');
                let $errorMsg = $parent.find('.error-msg');
                let fieldValid = true;

                // Create error msg if not exists
                if ($errorMsg.length === 0) {
                    $errorMsg = $('<span>', { class: 'error-msg' }).appendTo($parent);
                }

                if (!$input.val().trim()) {
                    fieldValid = false;
                    $parent.addClass('error');
                    $errorMsg.text('This field is required');
                } else if (id === 'email') {
                    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailPattern.test($input.val().trim())) {
                        fieldValid = false;
                        $parent.addClass('error');
                        $errorMsg.text('Please enter a valid email');
                    }
                } else if (id === 'phone') {
                    const phonePattern = /^[0-9+\-\s()]*$/;
                    const phoneVal = $input.val().trim();
                    // Max digits 10 check
                    if (!phonePattern.test(phoneVal) || phoneVal.replace(/[^0-9]/g, '').length < 7 || phoneVal.replace(/[^0-9]/g, '').length > 10) {
                        fieldValid = false;
                        $parent.addClass('error');
                        $errorMsg.text('Please enter a valid phone number (7-10 digits)');
                    }
                }

                if (!fieldValid) {
                    isValid = false;
                    if (!$firstErrorInput) {
                        $firstErrorInput = $input;
                    }
                }
            });

            if (isValid) {
                alert('Form submitted successfully!');
                $contactForm[0].reset();
                $('.contactFormGridItem.error').removeClass('error');
            } else if ($firstErrorInput) {
                $firstErrorInput.focus();
            }
        });
    }


    // --- Product Filtering Logic ---
    const $productsGrid = $('.productsGrid');
    if ($productsGrid.length) {
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
            $productsGrid.empty();
            const filteredProducts = filter === 'all'
                ? productsData
                : productsData.filter(product => product.category === filter);

            $.each(filteredProducts, function (index, product) {
                const aosDelay = index * 100;
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
                $productsGrid.append(productHTML);
            });

            // Refresh AOS
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        };

        // Initial Render
        renderProducts('all');

        // Filter Logic
        const $filterLinks = $('.productsMenu ul li a');
        const $productsMenuTrigger = $('.productsMenuTrigger');
        const $productsMenu = $('.productsMenu');

        if ($productsMenuTrigger.length) {
            $productsMenuTrigger.on('click', function () {
                $productsMenu.toggleClass('open');
            });

            // Set initial text
            const $activeLink = $('.productsMenu ul li a.active');
            if ($activeLink.length) {
                $productsMenuTrigger.text($activeLink.text());
            }
        }

        $filterLinks.on('click', function (e) {
            e.preventDefault();
            const $this = $(this);

            // Active Class
            $filterLinks.removeClass('active');
            $this.addClass('active');

            // Mobile: Update trigger text & close menu
            if ($productsMenuTrigger.length && $(window).width() <= 991) {
                $productsMenuTrigger.text($this.text());
                $productsMenu.removeClass('open');
            }

            // Render
            const filter = $this.attr('data-filter');
            renderProducts(filter);
        });
    }

    // --- Expertise Smooth Scroll Logic ---
    // Delegated Event Listener
    $(document).on('click', '.expertiseLink', function (e) {
        e.preventDefault();
        const $link = $(this);

        // Check if on about-us.html or section exists on current page
        if (window.location.pathname.includes('about-us.html') || $('#our-expertise').length) {
            const $targetSection = $('#our-expertise');
            if ($targetSection.length) {
                $('html, body').animate({
                    scrollTop: $targetSection.offset().top
                }, 800);
                history.pushState(null, null, '#our-expertise');
            }
        } else {
            // Navigate to about-us.html with hash
            window.location.href = 'about-us.html#our-expertise';
        }
    });

    // Handle initial load with hash
    if (window.location.hash === '#our-expertise') {
        const checkAndScroll = () => {
            const $section = $('#our-expertise');
            if ($section.length) {
                setTimeout(() => {
                    $('html, body').animate({
                        scrollTop: $section.offset().top
                    }, 800);
                }, 300);
            }
        };

        checkAndScroll();
        setTimeout(checkAndScroll, 800);
    }

    // MatchHeight for blog posts
    $('.blogItem > p').matchHeight();
});




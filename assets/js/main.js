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

    // Load Footer
    loadComponent("footer-placeholder", "components/footer.html");



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
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-vivace-nespresso.png',
                subtitle: 'Pellini Vivace Nespresso Compatible Aluminium Capsules, 10 Caps / Pack',
                description1: 'A Blend of Arabica and Robusta Coffee with full-bodied and Intense Taste with Notes of Cocoa and gingerbread.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso® ',
            },
            {
                id: 2,
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-cremoso-nespresso.png',
                subtitle: 'Pellini Cremoso Nespresso Compatible Aluminium Capsules, 10 Caps / Pack',
                description1: 'A Blend of Arabica and Robusta Coffee with Spicy Taste with Notes of Caramel and Hazelnut.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 3,
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-gran-aroma-nespresso.png',
                subtitle: 'Pellini Gran Aroma 100% Arabica, Nespresso Compatible Aluminum Capsules',
                description1: 'Delicate Blend  of 100 % Arabica Coffee with Floral and Bitter Almond Notes.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 4,
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-top-nespresso.png',
                subtitle: 'Pellini Top Nespresso Compatible Aluminium Capsules, 10 Caps / Pack',
                description1: 'A  Blend of 100% Arabica Coffee  with Hints of Cocoa and Citrus Fruits.',
                description2: 'Capsule in alluminio 80% riciclato compatibili Nespresso®',
            },
            {
                id: 5,
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-decaffeinato-nespresso.png',
                subtitle: 'Pellini Decaffeinato Nespresso Compatible Aluminium Capsules, 10 Caps / Pack',
                description1: 'A  Blend of Arabica and Robusta Coffee with Hints of Dried Fruits and Figs',
                description2: 'Aluminum capsules 80% recycled compatible with Nespresso® machines',
            },
            {
                id: 6,
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-cremoso-dolce-gusto.png',
                subtitle: 'PELLINI CREMOSO, Nescafé® Dolce Gusto® compatible capsule 10 pcs/Box',
                description1: 'An Espresso with a persistent cream and great aromatic richness that emphasises floral and fruity hints. Roasted and ground 100% Arabica Coffee.',
            },
            {
                id: 7,
                category: 'compatible-capsules',
                title: 'Compatible Capsules',
                image: 'assets/images/products/capsule-top-dolce-gusto.png',
                subtitle: 'PELLINI TOP, in Nescafé® Dolce Gusto® compatible capsules 10 pcs/Box',
                description1: 'A uniquely elegant, rich mosaic of aromas and flavours. Intense, enveloping aroma. Roasted and ground 100% Arabica Coffee.',
            },
            {
                id: 8,
                category: 'espresso-line',
                title: 'Espresso Line',
                image: 'assets/images/products/espresso-gran-aroma-250g.png',
                subtitle: 'Pellini Espresso Gusto Bar N°3 Gran Aroma ground coffee - 2x250g',
                description1: '100% Arabica beans',
                description2: 'Characteristic aftertaste due to particularly large beans',
                description3: 'Wet-processed espresso',
            },
            {
                id: 9,
                category: 'espresso-line',
                title: 'Espresso Line',
                image: 'assets/images/products/espresso-vellutato-250g.png',
                subtitle: 'Pellini Espresso Gusto Bar N°1 Vellutato ground coffee - 250 g',
                description1: '80% Arabica beans and 20% Robusta beans',
                description2: 'Spicy notes',
                description3: 'Gently roasted',
            },
            {
                id: 10,
                category: 'espresso-line',
                title: 'Espresso Line',
                image: 'assets/images/products/espresso-cremoso-250g.png',
                subtitle: 'Pellini Espresso Gusto Bar N°46 Cremoso ground coffee - 250 g',
                description1: '50% Arabica beans and 50% Robusta beans',
                description2: 'Sweetish taste',
                description3: 'Gently roasted',
            },
            {
                id: 11,
                category: 'moka-line',
                title: 'Moka Line',
                image: 'assets/images/products/moka-tradizionale-250g.png',
                subtitle: 'Pellini Espresso Superiore N°42 Tradizionale ground coffee - 250 g',
                description1: '60% Arabica beans and 40% Robusta beans',
                description2: 'Intense and spicy taste',
                description3: 'Malty and chocolaty flavours',
            },
            {
                id: 12,
                category: 'moka-line',
                title: 'Moka Line',
                image: 'assets/images/products/moka-cremoso-250g.png',
                subtitle: 'Pellini Espresso Superiore N°20 Cremoso ground coffee - 250 g',
                description1: '50% Arabica beans',
                description2: '50% Robusta beans',
                description3: 'Grinding ideal for the mocha pot',
                description4: 'Medium roast',
            },
            {
                id: 13,
                category: 'moka-line',
                title: 'Moka Line',
                image: 'assets/images/products/moka-vellutato-250g.png',
                subtitle: 'Pellini N°2 Vellutato ground coffee - 250 g',
                description1: '80% Arabica beans and 20% Robusta beans',
                description2: 'Particularly suitable for moka and filter coffee',
                description3: 'Intense aroma',
            },
            {
                id: 14,
                category: 'moka-line',
                title: 'Moka Line',
                image: 'assets/images/products/moka-top-arabica-250g.png',
                subtitle: 'Pellini Top Arabica 100% Ground Coffee-250g',
                description1: '100% Arabica beans',
                description2: 'roasted with hints of flowers and chocolate.',
                description3: 'Mild and low in acid',
            },
            {
                id: 15,
                category: 'whole-beans',
                title: 'Whole Beans',
                image: 'assets/images/products/beans-cremoso-1000g.png',
                subtitle: 'Pellini Espresso Bar No. 9 Cremoso No. 9 whole bean - 1000 g',
                description1: '50% Arabica beans and 50% Robusta beans',
                description2: 'Pleasantly mild in taste',
                description3: 'Nutty flavours',
            },
            {
                id: 16,
                category: 'whole-beans',
                title: 'Whole Beans',
                image: 'assets/images/products/beans-gran-aroma-1000g.png',
                subtitle: 'Pellini Espresso Bar N°3 Gran Aroma whole bean - 1000 g',
                description1: 'Selected 100% Arabica beans.',
                description2: 'Characteristic aftertaste due to particularly large beans',
                description3: 'Wet-processed espresso',
                description4: 'Gently drum- roasted according to origin 100 % Arabica composition',
            },
            {
                id: 17,
                category: 'whole-beans',
                title: 'Whole Beans',
                image: 'assets/images/products/beans-vivace-500g.png',
                subtitle: 'Pellini Espresso Bar N°82 Vivace whole bean - 500 g',
                description1: '60% Arabica beans and 40% Robusta beans',
                description2: 'Notes of chocolate',
                description3: 'Velvety crema',
            },
            {
                id: 18,
                category: 'whole-beans',
                title: 'Whole Beans',
                image: 'assets/images/products/beans-bio-arabica-500g.png',
                subtitle: 'Pellini BIO 100% Arabica organic whole bean - 500 g',
                description1: '100% Arabica beans',
                description2: 'Fruity and nutty',
                description3: 'From organic farming',
            },
            {
                id: 19,
                category: 'whole-beans',
                title: 'Whole Beans',
                image: 'assets/images/products/beans-top-arabica-500g.png',
                subtitle: 'Pellini Top 100% Arabica Whole Beans-500 g',
                description1: 'Whole beans 100% Arabica beans',
                description2: 'Fruity flavours',
                description3: 'Mild and low-acid taste',
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
                                ${product.description1 ? `<p>${product.description1}</p>` : ''}
                                ${product.description2 ? `<p>${product.description2}</p>` : ''}
                                ${product.description3 ? `<p>${product.description3}</p>` : ''}
                                ${product.description4 ? `<p>${product.description4}</p>` : ''}
                                </div>  
                                <div class='productsGridItemImageOverlayEnquiry'>           
                                <img src="assets/images/products/whatsapp.png" alt="whatsapp" width="17" height="17" />
                                Enquiry by Whatsapp
                                </div>                                
                            </a>
                        </div>
                        <div class="productsGridItemContent">   
                            ${filter === 'all' ? `<p>${product.title}</p>` : ''}               
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




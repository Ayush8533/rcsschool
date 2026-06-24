/* ============================================================
   RCS SCHOOL — scroll-animations.js
   Paste this ENTIRE script at the bottom of your index.html
   BEFORE the closing </body> tag, after all other scripts.
   ============================================================ */

(function () {
    'use strict';

    /* ── 1. INTERSECTION OBSERVER SETUP ─────────────────────── */
    var observerOptions = {
        threshold: 0.12,          /* element 12% visible = trigger */
        rootMargin: '0px 0px -40px 0px'   /* slightly early on scroll up */
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); /* fire once only */
            }
        });
    }, observerOptions);

    /* ── 2. TAG ELEMENTS FOR SCROLL REVEAL ──────────────────── */
    function tagReveal(selector, classes) {
        document.querySelectorAll(selector).forEach(function (el) {
            el.classList.add('reveal');
            if (classes) {
                classes.forEach(function (c) { el.classList.add(c); });
            }
            observer.observe(el);
        });
    }

    function tagRevealStagger(parentSelector) {
        document.querySelectorAll(parentSelector).forEach(function (parent) {
            parent.classList.add('reveal', 'stagger-children');
            Array.from(parent.children).forEach(function (child) {
                child.classList.add('reveal');
                observer.observe(child);
            });
            observer.observe(parent);
        });
    }

    /* ── 3. APPLY CLASSES TO EACH SECTION ───────────────────── */

    /* About section — text columns fade up, images come from sides */
    document.querySelectorAll('.flex-row .text-col').forEach(function (el, i) {
        el.classList.add('reveal', i % 2 === 0 ? 'reveal-left' : 'reveal-right');
        observer.observe(el);
    });
    document.querySelectorAll('.flex-row .img-box').forEach(function (el, i) {
        el.classList.add('reveal', i % 2 === 0 ? 'reveal-right' : 'reveal-left');
        observer.observe(el);
    });

    /* Section headings */
    tagReveal('#about h2, #academics h2, #admission h2, #result-checker h2, #gallery h2, #testimonials h2, #ptm-booking h2, #contact h2', ['reveal-flip']);

    /* Facilities — stagger cards */
    tagReveal('.facility-card', ['reveal-scale']);

    /* Calendar cards — stagger */
    tagReveal('.cal-card', ['reveal']);

    /* Leadership cards */
    tagReveal('.leader-card', ['reveal-scale']);

    /* Principal card */
    tagReveal('.principal-card', ['reveal']);

    /* Gallery images — scale in */
    tagReveal('.gallery-grid img', ['reveal-scale']);

    /* Testimonials */
    tagReveal('.testi-card', ['reveal']);

    /* Curriculum table */
    tagReveal('.curriculum-table', ['reveal']);

    /* Contact */
    tagReveal('.contact-card', ['reveal-left']);
    tagReveal('.map-container', ['reveal-right']);

    /* Footer */
    tagReveal('.footer-grid > div', ['reveal']);

    /* Admission form */
    tagReveal('.admission-container', ['reveal']);

    /* PTM form */
    tagReveal('.ptm-form-box', ['reveal']);

    /* ── 4. STAGGER TIMING FOR GRIDS ────────────────────────── */
    /* Facilities grid — add incremental delay to each card */
    document.querySelectorAll('.facilities-grid .facility-card').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.07) + 's';
    });

    /* Calendar cards */
    document.querySelectorAll('.calendar-grid .cal-card').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.09) + 's';
    });

    /* Gallery images */
    document.querySelectorAll('.gallery-grid img').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.05) + 's';
    });

    /* Testimonial cards */
    document.querySelectorAll('.testimonials-grid .testi-card').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.08) + 's';
    });

    /* Leader cards */
    document.querySelectorAll('.leadership-grid .leader-card').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.1) + 's';
    });

    /* Footer grid items */
    document.querySelectorAll('.footer-grid > div').forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.08) + 's';
    });

    /* ── 5. SMOOTH ACTIVE NAV HIGHLIGHT ─────────────────────── */
    var sections = document.querySelectorAll('[id]');
    var navLinks = document.querySelectorAll('nav a[href^="#"]');

    var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(function (s) { navObserver.observe(s); });

    /* Nav active style */
    var navStyle = document.createElement('style');
    navStyle.textContent = '.nav-active { background: var(--gold) !important; color: #000 !important; }';
    document.head.appendChild(navStyle);

    /* ── 6. SMOOTH RIPPLE ON BUTTONS ────────────────────────── */
    document.querySelectorAll('.btn-submit, .result-search-btn, .ptm-submit-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;

            var ripple = document.createElement('span');
            ripple.style.cssText = [
                'position:absolute',
                'border-radius:50%',
                'width:10px', 'height:10px',
                'background:rgba(255,255,255,0.35)',
                'transform:scale(0)',
                'animation:rippleAnim 0.55s ease-out forwards',
                'left:' + (x - 5) + 'px',
                'top:'  + (y - 5) + 'px',
                'pointer-events:none'
            ].join(';');

            btn.style.position = btn.style.position || 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 600);
        });
    });

    /* Ripple keyframe */
    var rippleStyle = document.createElement('style');
    rippleStyle.textContent = '@keyframes rippleAnim { to { transform: scale(28); opacity: 0; } }';
    document.head.appendChild(rippleStyle);

    /* ── 7. PARALLAX SCROLL ON HERO IMAGES (subtle) ──────────── */
    var heroImgs = document.querySelectorAll('.flex-row .img-box img');
    var isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (!isMobile && heroImgs.length) {
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    heroImgs.forEach(function (img) {
                        var rect = img.closest('.img-box').getBoundingClientRect();
                        var centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
                        var shift = centerY * 0.06; /* subtle: 6% of distance */
                        img.style.transform = 'translateY(' + shift + 'px)';
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── 8. NUMBER COUNTER ANIMATION (for stats if any) ──────── */
    function animateCount(el, target, duration) {
        var start = 0;
        var step = target / (duration / 16);
        var timer = setInterval(function () {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            el.textContent = Math.round(start) + (el.dataset.suffix || '');
        }, 16);
    }

    /* Auto-detect elements with data-count attribute */
    var countEls = document.querySelectorAll('[data-count]');
    var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCount(entry.target, parseInt(entry.target.dataset.count), 1800);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { countObserver.observe(el); });

    /* ── 9. SMOOTH HASH SCROLL ───────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ── 10. STICKY NAV SHADOW ON SCROLL ────────────────────── */
    var nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 60) {
                nav.style.boxShadow = '0 4px 20px rgba(0,33,71,0.15)';
            } else {
                nav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        }, { passive: true });
    }

    /* ── 11. IMAGE LAZY LOADING WITH FADE ───────────────────── */
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    lazyImgs.forEach(function (img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function () {
                img.style.opacity = '1';
            });
        }
    });

    /* ── DONE ───────────────────────────────────────────────── */
    console.log('[RCS Animations] ✅ Loaded successfully');

    // Premium Text Scroll Animation

const textItems = document.querySelectorAll(
    "p, h2, h3, .quote-block"
);

const textObserver = new IntersectionObserver((items)=>{
    
    items.forEach(item=>{

        if(item.isIntersecting){

            item.target.classList.add("show");
            item.target.classList.add("show-line");
        }

    });

},{
    threshold:0.2
});


textItems.forEach(item=>{

    item.classList.add("text-animate");
    textObserver.observe(item);

});

})();
document.addEventListener('DOMContentLoaded', () => {

    /* --- GLOBAL SETTINGS --- */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* --- SCROLL REVEAL ALGORITHM --- */
    // Using Intersection Observer for performant, staggered fade-ups
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    /* --- FLOATING NAVBAR LOGIC --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- MOBILE MENU --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            // Optional visually toggling burger
            const lines = mobileMenuBtn.querySelectorAll('.burger-line');
            if (mobileMenu.classList.contains('active')) {
                lines[0].style.transform = 'translateY(4px) rotate(45deg)';
                lines[1].style.transform = 'translateY(-4px) rotate(-45deg)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.transform = 'none';
            }
        });
    }

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const lines = mobileMenuBtn.querySelectorAll('.burger-line');
            lines[0].style.transform = 'none';
            lines[1].style.transform = 'none';
        });
    });

    /* --- HERO DONATION PHYSICS & EASE --- */
    const targetAmount = 250000;
    const finalAmount = 50700;
    const durationMs = 3000;
    const counterDisplay = document.getElementById('hero-raised');
    const progFill = document.getElementById('hero-progress');
    const progGlow = document.getElementById('hero-glow');

    let startTime = null;

    // Custom Spring-like Easing
    const easeOutExpo = (x) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    if (counterDisplay) {
        const runCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / durationMs, 1);

            const easedProgress = easeOutExpo(progress);
            const currentVal = Math.floor(easedProgress * finalAmount);

            // Format with commas
            counterDisplay.textContent = currentVal.toLocaleString('en-GB');

            if (progress < 1) {
                requestAnimationFrame(runCounter);
            } else {
                counterDisplay.textContent = finalAmount.toLocaleString('en-GB');

                // Trigger Progress Bar Fill
                const percent = (finalAmount / targetAmount) * 100;
                if (progFill) progFill.style.width = percent + '%';
                if (progGlow) progGlow.style.width = percent + '%';
            }
        };

        // Delay start slightly for visual impact upon load
        setTimeout(() => {
            requestAnimationFrame(runCounter);
        }, 500);
    }


    /* --- INFINITE MARQUEE --- */
    const marqueeTrack = document.getElementById('marquee');
    const marqueeData = [
        "Sister Fatima - £250", "The Hassan Family - £1,500", "Anonymous - £50",
        "Brother Yusuf - £100", "Zaid M. - £500", "Ayub Khan - £20",
        "Sister Aisha - £75", "Anonymous - £2,000"
    ];

    const generateMarqueeItems = () => {
        return marqueeData.map(item => `
            <div class="mq-item">
                <div class="mq-dot"></div>
                ${item}
            </div>
        `).join('');
    };

    // Double the items for seamless looping
    if (marqueeTrack) {
        const payload = generateMarqueeItems();
        marqueeTrack.innerHTML = payload + payload + payload; // Triple to ensure track covers ultrawides
    }


    /* --- 3D CINEMATIC MODEL CONTROLLER --- */
    const phaseTabs = document.querySelectorAll('.phase-tab');
    const infoBlocks = document.querySelectorAll('.info-block');
    const masjidContainer = document.getElementById('masjid-container');
    const scene3d = document.querySelector('.scene-3d');

    // Camera preset angles for different phases to add cinematic feel
    const cameraPresets = {
        0: 'translateY(-30px) translateX(-30px) rotateX(82deg) rotateZ(-35deg) scale(0.95)', // Extreme top-down to see over tall walls
        1: 'translateY(-30px) translateX(-30px) rotateX(82deg) rotateZ(-35deg) scale(0.95)', // Extreme top-down to see over tall walls
        2: 'translateY(0px) translateX(-40px) rotateX(55deg) rotateZ(-45deg) scale(0.9)', // Rotate down to feature the protruding porch
        3: 'translateY(30px) translateX(-30px) rotateX(65deg) rotateZ(-40deg) scale(0.75)'   // Pull back and pan up to fit the tall minaret
    };

    phaseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const phase = tab.getAttribute('data-phase');

            // 1. Update Tabs UI
            phaseTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. Update Info Panel
            infoBlocks.forEach(block => block.classList.remove('active'));
            document.getElementById(`desc-phase-${phase}`).classList.add('active');

            // 3. Update Model State Classes
            // Strip all phase classes first
            masjidContainer.className = 'masjid-3d';

            // Apply cumulative classes
            if (phase >= 0) masjidContainer.classList.add('phase-0-state');
            if (phase >= 1) masjidContainer.classList.add('phase-1-state');
            if (phase >= 2) masjidContainer.classList.add('phase-2-state');
            if (phase >= 3) masjidContainer.classList.add('phase-3-state');

            // 4. Transform Camera Angle
            if (scene3d) {
                scene3d.style.transform = cameraPresets[phase];
            }
        });
    });


    /* --- FINTECH DONATE LOGIC --- */
    const segBtns = document.querySelectorAll('.seg-btn');
    const amtBtns = document.querySelectorAll('.amt-btn');
    const customAmt = document.getElementById('custom-donation');
    const finalBtn = document.getElementById('final-donate-btn');

    let donateType = 'one-time';
    let donateAmt = '50';

    const updateDonateBtn = () => {
        const timeframe = donateType === 'monthly' ? ' Monthly' : '';
        const amtStr = donateAmt ? `£${donateAmt}` : 'Custom Amount';
        finalBtn.textContent = `Donate ${amtStr}${timeframe}`;
    };

    segBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            donateType = btn.getAttribute('data-type');
            updateDonateBtn();
        });
    });

    amtBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amtBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            donateAmt = btn.getAttribute('data-val');

            if (customAmt) customAmt.value = ''; // Clear custom entry
            updateDonateBtn();
        });
    });

    if (customAmt) {
        customAmt.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val) {
                amtBtns.forEach(b => b.classList.remove('active'));
                // Just use the raw number string for the button display, formatting if needed
                donateAmt = parseFloat(val).toLocaleString('en-GB');
            } else {
                // Revert to 50 if cleared
                amtBtns[1].classList.add('active');
                donateAmt = '50';
            }
            updateDonateBtn();
        });
    }


    /* --- PORTAL MODAL --- */
    const portalModal = document.getElementById('portal-modal');

    window.openModal = (type = 'login') => {
        if (portalModal) {
            portalModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = () => {
        if (portalModal) {
            portalModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close on backdrop click
    if (portalModal) {
        portalModal.addEventListener('click', (e) => {
            if (e.target === portalModal) {
                closeModal();
            }
        });
    }

    // Escape Key logic
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portalModal && portalModal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- GAMIFIED DONATION PORTAL ---
    function initDonatePortal() {
        // 1. Interactive Mapper
        const mapGrid = document.getElementById('sponsor-map');
        if (mapGrid) {
            // Generate 300 tiles for the massive "Full Hall" floor plan
            for (let i = 0; i < 300; i++) {
                const tile = document.createElement('div');
                tile.className = 'mapper-tile';
                tile.style.transitionDelay = `${(i % 10) * 0.02}s`;

                // Randomly mark some as sponsored to show social proof
                const isSponsored = Math.random() < 0.35;
                if (isSponsored) {
                    tile.classList.add('sponsored');
                    const families = ["The Khan Family", "Anonymous", "Ali Family", "Hussain Family", "In Memory of Parents", "Syed Family"];
                    const name = families[Math.floor(Math.random() * families.length)];
                    tile.innerHTML = `<div class="tooltip">Sponsored by<br><strong style="color:var(--bg-body)">${name}</strong></div>`;
                } else {
                    tile.innerHTML = `<div class="tooltip"><strong>Available</strong><br>Click to sponsor (£500)</div>`;
                }
                mapGrid.appendChild(tile);
            }
        }

        // 2. Continuous Ticker
        const ticker = document.getElementById('donor-ticker-scroll');
        if (ticker) {
            const donations = [
                { name: "Anonymous", amount: "£50", time: "2 mins ago", msg: "May Allah accept", bg: "var(--c-gold-main)" },
                { name: "S. Malik", amount: "£250", time: "15 mins ago", msg: "For my late father", bg: "var(--c-green-light)" },
                { name: "Anonymous", amount: "£20", time: "1 hour ago", msg: "Monthly Sadaqah", bg: "var(--bg-accent)" },
                { name: "The Khan Family", amount: "£500", time: "3 hours ago", msg: "Musallah Sponsorship", bg: "var(--c-gold-main)" },
                { name: "Aisha R.", amount: "£100", time: "5 hours ago", msg: "Alhamdulillah", bg: "var(--c-green)" }
            ];

            // Create HTML string
            let tickerHTML = '';
            const createItem = (d) => `
                <div class="ticker-item">
                    <div class="ticker-avatar" style="background: ${d.bg}; color: ${d.bg === 'var(--c-gold-main)' || d.bg === 'var(--bg-accent)' ? '#000' : '#fff'}">
                        ${d.name === 'Anonymous' ? '<i class="fa-solid fa-user-secret"></i>' : d.name.charAt(0)}
                    </div>
                    <div style="flex-grow: 1;">
                        <div style="color: white; font-weight: 500; font-size: 0.95rem; display: flex; justify-content: space-between;">
                            ${d.name} <span class="text-gradient-gold">${d.amount}</span>
                        </div>
                        <div class="text-gray" style="font-size: 0.8rem; margin-top: 2px;">
                            ${d.msg} &bull; ${d.time}
                        </div>
                    </div>
                </div>
            `;

            donations.forEach(d => tickerHTML += createItem(d));
            // Duplicate for seamless infinite scroll
            donations.forEach(d => tickerHTML += createItem(d));

            ticker.innerHTML = tickerHTML;
        }

        // 3. Impact Translation UI
        const amountBtns = document.querySelectorAll('.amt-btn');
        const donateBtn = document.getElementById('final-donate-btn');

        // Create impact text element
        const impactText = document.createElement('div');
        impactText.className = 'impact-translation fade-up';
        impactText.style.textAlign = 'center';
        impactText.style.marginTop = '1.5rem';
        impactText.style.color = 'var(--c-gold-main)';
        impactText.style.fontSize = '0.95rem';
        impactText.style.fontWeight = '500';
        impactText.style.transition = 'opacity 0.3s ease';

        // Find the secure badge to insert before
        const secureBadge = document.querySelector('.secure-badge');
        if (secureBadge && donateBtn) {
            secureBadge.parentNode.insertBefore(impactText, secureBadge);
        }

        const impactMap = {
            '25': '<i class="fa-solid fa-book-open" style="margin-right: 5px;"></i> Provides learning materials for 5 Madrassah students.',
            '50': '<i class="fa-solid fa-hand-holding-heart" style="margin-right: 5px;"></i> Feeds 10 fasting members of the community.',
            '100': '<i class="fa-solid fa-lightbulb" style="margin-right: 5px;"></i> Covers center heating and electricity for a week.',
            '250': '<i class="fa-solid fa-mosque" style="margin-right: 5px;"></i> Funds critical maintenance for the main prayer hall.'
        };

        function updateImpact(val) {
            if (impactMap[val]) {
                impactText.innerHTML = impactMap[val];
                impactText.style.opacity = '0';
                setTimeout(() => impactText.style.opacity = '1', 50);
            } else {
                impactText.innerHTML = "Every penny counts towards building the House of Allah.";
                impactText.style.opacity = '0';
                setTimeout(() => impactText.style.opacity = '1', 50);
            }
        }

        // Initialize with default 50
        updateImpact('50');

        amountBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = e.target.getAttribute('data-val');
                updateImpact(val);
            });
        });

        const customInput = document.getElementById('custom-donation');
        if (customInput) {
            customInput.addEventListener('input', (e) => {
                if (e.target.value) {
                    updateImpact('custom');
                } else {
                    updateImpact('50'); // default fallback if empty
                }
            });
        }
    }

    // Call the initializer
    initDonatePortal();

});

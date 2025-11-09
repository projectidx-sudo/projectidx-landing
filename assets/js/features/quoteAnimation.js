export function initInspirationalQuote(performanceSettings = {}) {
    const quoteSettings = performanceSettings.quote ?? {};
    const prefersReducedMotion = performanceSettings.prefersReducedMotion ?? false;
    const {
        tiltIntensity = 15,
        enableIdleFloat = true,
        particleCount = 10,
        enableIdleJitter = true
    } = quoteSettings;
    const quoteContainer = document.querySelector('.inspirational-quote');
    const quoteText = document.querySelector('.quote-text');
    const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches ?? true;

    if (!quoteContainer || !quoteText) {
        return;
    }

    if (!prefersReducedMotion && typeof ScrollTrigger !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from(quoteContainer, {
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: quoteContainer,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            }
        });
    } else {
        gsap.set(quoteContainer, { opacity: 1, y: 0 });
    }

    if (enableIdleFloat) {
        gsap.to(quoteContainer, {
            y: 15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    quoteContainer.addEventListener('mousemove', (event) => {
        if (!hasFinePointer) return;
        const rect = quoteContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;

        gsap.to(quoteContainer, {
            rotationY: moveX * tiltIntensity,
            rotationX: -moveY * tiltIntensity,
            transformPerspective: 1000,
            transformOrigin: 'center center',
            ease: 'power2.out',
            duration: 0.5
        });

        gsap.to(quoteContainer, {
            boxShadow: '0 0 40px rgba(255, 140, 0, 0.8)',
            duration: 0.3
        });

        gsap.to(quoteText, {
            scale: 1.05,
            textShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
            duration: 0.3
        });
    });

    quoteContainer.addEventListener('mouseleave', () => {
        if (!hasFinePointer) return;
        gsap.to(quoteContainer, {
            rotationY: 0,
            rotationX: 0,
            boxShadow: '0 0 25px rgba(255, 140, 0, 0.6)',
            duration: 0.5
        });

        gsap.to(quoteText, {
            scale: 1,
            textShadow: '0 0 5px rgba(255, 140, 0, 0.5)',
            duration: 0.3
        });
    });

    if (enableIdleJitter) {
        setInterval(() => {
            if (Math.random() > 0.8) {
                gsap.to(quoteText, {
                    skewX: gsap.utils.random(-5, 5),
                    skewY: gsap.utils.random(-3, 3),
                    duration: 0.2,
                    onComplete: () => {
                        gsap.to(quoteText, {
                            skewX: 0,
                            skewY: 0,
                            duration: 0.2
                        });
                    }
                });

                gsap.to(quoteText, {
                    textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 140, 0, 1)',
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(quoteText, {
                            textShadow: '0 0 5px rgba(255, 140, 0, 0.5)',
                            duration: 0.1
                        });
                    }
                });
            }
        }, 5000);
    }

    if (particleCount > 0) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'quote-particle';
            particle.style.position = 'absolute';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = '#ff8c00';
            particle.style.opacity = '0.7';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';

            gsap.set(particle, {
                x: gsap.utils.random(0, quoteContainer.offsetWidth),
                y: gsap.utils.random(0, quoteContainer.offsetHeight)
            });

            quoteContainer.appendChild(particle);

            gsap.to(particle, {
                x: gsap.utils.random(0, quoteContainer.offsetWidth),
                y: gsap.utils.random(0, quoteContainer.offsetHeight),
                opacity: gsap.utils.random(0.3, 0.7),
                duration: gsap.utils.random(3, 7),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }
}

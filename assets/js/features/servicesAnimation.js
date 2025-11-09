export function initServicesAnimation(performanceSettings = {}) {
    const servicesSettings = performanceSettings.services ?? {};
    const {
        tiltIntensity = 12,
        enableIdleJitter = true
    } = servicesSettings;
    const serviceBoxes = document.querySelectorAll('.service-box');
    const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches ?? true;
    if (!serviceBoxes.length) {
        return;
    }

    serviceBoxes.forEach((box) => {
        box.addEventListener('mousemove', (event) => {
            if (!hasFinePointer) return;
            const rect = box.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const moveX = (x - centerX) / centerX;
            const moveY = (y - centerY) / centerY;

            gsap.to(box, {
                rotationY: moveX * tiltIntensity,
                rotationX: -moveY * tiltIntensity,
                transformPerspective: 1000,
                transformOrigin: 'center center',
                ease: 'power2.out',
                duration: 0.5
            });

            gsap.to(box, {
                boxShadow: '0 0 30px rgba(255, 140, 0, 0.8)',
                border: '1px solid rgba(255, 140, 0, 0.8)',
                duration: 0.3
            });

            const icon = box.querySelector('.service-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.2,
                    color: '#ffbb33',
                    textShadow: '0 0 20px rgba(255, 140, 0, 1)',
                    duration: 0.3
                });
            }

            const price = box.querySelector('.service-price');
            if (price) {
                gsap.to(price, {
                    scale: 1.05,
                    textShadow: '0 0 15px rgba(255, 140, 0, 0.8)',
                    duration: 0.3
                });
            }
        });

        box.addEventListener('mouseleave', () => {
            if (!hasFinePointer) return;
            gsap.to(box, {
                rotationY: 0,
                rotationX: 0,
                boxShadow: '0 0 10px rgba(255, 140, 0, 0.2)',
                border: '1px solid var(--primary-color)',
                duration: 0.5
            });

            const icon = box.querySelector('.service-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    color: 'var(--primary-color)',
                    textShadow: 'none',
                    duration: 0.3
                });
            }

            const price = box.querySelector('.service-price');
            if (price) {
                gsap.to(price, {
                    scale: 1,
                    textShadow: '0 0 10px rgba(255, 140, 0, 0.5)',
                    duration: 0.3
                });
            }
        });

        if (enableIdleJitter) {
            setInterval(() => {
                if (Math.random() > 0.7) {
                    gsap.to(box, {
                        skewX: gsap.utils.random(-2, 2),
                        skewY: gsap.utils.random(-1, 1),
                        duration: 0.1,
                        onComplete: () => {
                            gsap.to(box, {
                                skewX: 0,
                                skewY: 0,
                                duration: 0.1
                            });
                        }
                    });
                }
            }, 4000);
        }
    });

    const ctaButtons = document.querySelectorAll('.service-cta');
    ctaButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 140, 0, 0.3)';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '1';

            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            gsap.to(ripple, {
                scale: 15,
                opacity: 0,
                duration: 0.8,
                ease: 'power1.out',
                onComplete: () => {
                    ripple.remove();
                }
            });
        });
    });
}

import { createHolographicEffect } from '../core/hologramEffect.js';

export function initProfileAnimation(performanceSettings = {}) {
    const profileSettings = performanceSettings.profile ?? {};
    const {
        enableIdleFloat = true,
        enableHoverTilt = true,
        enableHoverEnhancements = true,
        enableGlitchEffect = true
    } = profileSettings;
    const profileImg = document.querySelector('.profile-img');
    const profileContainer = document.querySelector('.profile-img-container');

    if (!profileImg || !profileContainer) {
        return;
    }

    if (enableIdleFloat) {
        gsap.to(profileContainer, {
            y: 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    if (enableHoverEnhancements) {
        profileContainer.addEventListener('mouseenter', () => {
            gsap.to(profileImg, {
                scale: 1.1,
                duration: 0.5,
                ease: 'power2.out',
                filter: 'brightness(1.2) contrast(1.2) saturate(1.2)'
            });

            gsap.to(profileContainer, {
                boxShadow: '0 0 30px rgba(255, 140, 0, 0.8)',
                duration: 0.5
            });
        });

        profileContainer.addEventListener('mouseleave', () => {
            gsap.to(profileImg, {
                scale: 1,
                duration: 0.5,
                ease: 'power2.out',
                filter: 'brightness(1.1) contrast(1.1) saturate(1)'
            });

            gsap.to(profileContainer, {
                boxShadow: '0 0 20px rgba(255, 140, 0, 0.5)',
                duration: 0.5
            });
        });
    }

    if (enableHoverTilt) {
        document.addEventListener('mousemove', (event) => {
            if (window.innerWidth <= 768) return;

            const { left, top, width, height } = profileContainer.getBoundingClientRect();
            const x = event.clientX - left;
            const y = event.clientY - top;

            const centerX = width / 2;
            const centerY = height / 2;

            const moveX = (x - centerX) / centerX;
            const moveY = (y - centerY) / centerY;

            if (Math.abs(x - centerX) < width / 1.5 && Math.abs(y - centerY) < height / 1.5) {
                gsap.to(profileImg, {
                    x: moveX * 10,
                    y: moveY * 10,
                    rotationY: moveX * 5,
                    rotationX: -moveY * 5,
                    duration: 1
                });
            }
        });
    }

    if (enableGlitchEffect) {
        setInterval(() => {
            gsap.to(profileImg, {
                skewX: gsap.utils.random(-5, 5),
                duration: 0.1,
                onComplete: () => {
                    gsap.to(profileImg, {
                        skewX: 0,
                        duration: 0.1
                    });
                }
            });

            gsap.to(profileImg, {
                filter: 'brightness(1.3) contrast(1.3) saturate(1.3) hue-rotate(30deg)',
                duration: 0.1,
                onComplete: () => {
                    gsap.to(profileImg, {
                        filter: 'brightness(1.1) contrast(1.1) saturate(1)',
                        duration: 0.1
                    });
                }
            });
        }, 5000);
    }

    createHolographicEffect(profileContainer, performanceSettings);
}

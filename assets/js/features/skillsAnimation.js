export function initSkillsAnimation(performanceSettings = {}) {
    const skillsSettings = performanceSettings.skills ?? {};
    const {
        particlesPerIcon = 10,
        tiltIntensity = 15,
        enableIdleJitter = true
    } = skillsSettings;
    const skillsSection = document.getElementById('skills');
    const skillBoxes = document.querySelectorAll('.skill-box');
    const skillIcons = document.querySelectorAll('.skill-icon');
    const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches ?? true;

    if (!skillsSection || !skillBoxes.length) {
        return;
    }

    if (particlesPerIcon > 0) {
        skillIcons.forEach((icon) => {
            const particleContainer = document.createElement('div');
            particleContainer.className = 'skill-particles';
            icon.appendChild(particleContainer);

            for (let i = 0; i < particlesPerIcon; i++) {
                const particle = document.createElement('div');
                particle.className = 'skill-particle';
                particleContainer.appendChild(particle);

                gsap.set(particle, {
                    left: `${gsap.utils.random(0, 100)}%`,
                    top: `${gsap.utils.random(0, 100)}%`,
                    scale: gsap.utils.random(0.5, 1),
                    opacity: gsap.utils.random(0.3, 0.8)
                });

                gsap.to(particle, {
                    y: gsap.utils.random(-20, 20),
                    x: gsap.utils.random(-20, 20),
                    opacity: gsap.utils.random(0.1, 0.5),
                    duration: gsap.utils.random(2, 4),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        });
    }

    skillBoxes.forEach((box) => {
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

            const icon = box.querySelector('.skill-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.2,
                    color: '#ffbb33',
                    textShadow: '0 0 20px rgba(255, 140, 0, 1)',
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

            const icon = box.querySelector('.skill-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    color: 'var(--primary-color)',
                    textShadow: 'none',
                    duration: 0.3
                });
            }
        });

        if (enableIdleJitter) {
            setInterval(() => {
                if (Math.random() > 0.7) {
                    gsap.to(box, {
                        skewX: gsap.utils.random(-3, 3),
                        skewY: gsap.utils.random(-2, 2),
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
            }, 3000);
        }
    });

    skillBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            const ripple = document.createElement('div');
            ripple.className = 'skill-ripple';
            box.appendChild(ripple);

            gsap.to(ripple, {
                scale: 15,
                opacity: 0,
                duration: 0.8,
                ease: 'power1.out',
                onComplete: () => {
                    ripple.remove();
                }
            });

            gsap.to(box, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power1.out',
                onComplete: () => {
                    gsap.to(box, {
                        scale: 1,
                        duration: 0.2
                    });
                }
            });
        });
    });
}

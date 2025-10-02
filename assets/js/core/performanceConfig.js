const clampPixelRatio = (tier) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    if (tier === 'low') {
        return Math.min(devicePixelRatio, 1.2);
    }
    if (tier === 'medium') {
        return Math.min(devicePixelRatio, 1.6);
    }
    return Math.min(devicePixelRatio, 2);
};

const detectTier = ({ prefersReducedMotion, saveData, hardwareConcurrency, deviceMemory }) => {
    if (prefersReducedMotion || saveData) {
        return 'low';
    }
    if (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 4) {
        return 'low';
    }
    if (typeof deviceMemory === 'number' && deviceMemory > 0 && deviceMemory <= 4) {
        return 'low';
    }
    if (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 6) {
        return 'medium';
    }
    if (typeof deviceMemory === 'number' && deviceMemory > 0 && deviceMemory <= 6) {
        return 'medium';
    }
    return 'high';
};

export function getPerformanceSettings() {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const saveData = navigator.connection?.saveData ?? false;
    const hardwareConcurrency = navigator.hardwareConcurrency ?? undefined;
    const deviceMemory = navigator.deviceMemory ?? undefined;

    const tier = detectTier({ prefersReducedMotion, saveData, hardwareConcurrency, deviceMemory });

    const base = {
        tier,
        prefersReducedMotion,
        saveData
    };

    const sharedScene = {
        maxPixelRatio: clampPixelRatio(tier),
        autoRotate: true,
        mouseParallaxMultiplier: tier === 'low' ? 0 : tier === 'medium' ? 0.07 : 0.1,
        touchParallaxMultiplier: tier === 'low' ? 0 : tier === 'medium' ? 0.04 : 0.05,
        digitalNumberRefreshIntervalMs: tier === 'low' ? 250 : tier === 'medium' ? 150 : 80,
        starParticleSize: tier === 'low' ? 0.08 : tier === 'medium' ? 0.09 : 0.1,
        pauseWhenHidden: true
    };

    const tierOverrides = {
        low: {
            scene: {
                earthSegments: 32,
                starFieldParticleCount: 1800,
                randomLineCount: 18,
                autoRotateSpeed: 0.2,
                gridHelperSize: 60,
                gridHelperDivisions: 40
            },
            hologram: {
                enabled: false,
                particleCount: 0,
                dynamicJitter: false
            },
            profile: {
                enableIdleFloat: false,
                enableHoverTilt: false,
                enableHoverEnhancements: true,
                enableGlitchEffect: false
            },
            skills: {
                particlesPerIcon: 3,
                tiltIntensity: 8,
                enableIdleJitter: false
            },
            services: {
                tiltIntensity: 6,
                enableIdleJitter: false
            },
            quote: {
                tiltIntensity: 8,
                enableIdleFloat: false,
                particleCount: 4,
                enableIdleJitter: false
            }
        },
        medium: {
            scene: {
                earthSegments: 48,
                starFieldParticleCount: 3200,
                randomLineCount: 30,
                autoRotateSpeed: 0.35,
                gridHelperSize: 80,
                gridHelperDivisions: 60
            },
            hologram: {
                enabled: true,
                particleCount: 280,
                dynamicJitter: true
            },
            profile: {
                enableIdleFloat: true,
                enableHoverTilt: true,
                enableHoverEnhancements: true,
                enableGlitchEffect: true
            },
            skills: {
                particlesPerIcon: 6,
                tiltIntensity: 12,
                enableIdleJitter: true
            },
            services: {
                tiltIntensity: 10,
                enableIdleJitter: true
            },
            quote: {
                tiltIntensity: 12,
                enableIdleFloat: true,
                particleCount: 7,
                enableIdleJitter: true
            }
        },
        high: {
            scene: {
                earthSegments: 64,
                starFieldParticleCount: 5000,
                randomLineCount: 50,
                autoRotateSpeed: 0.5,
                gridHelperSize: 100,
                gridHelperDivisions: 100
            },
            hologram: {
                enabled: true,
                particleCount: 500,
                dynamicJitter: true
            },
            profile: {
                enableIdleFloat: true,
                enableHoverTilt: true,
                enableHoverEnhancements: true,
                enableGlitchEffect: true
            },
            skills: {
                particlesPerIcon: 10,
                tiltIntensity: 15,
                enableIdleJitter: true
            },
            services: {
                tiltIntensity: 12,
                enableIdleJitter: true
            },
            quote: {
                tiltIntensity: 15,
                enableIdleFloat: true,
                particleCount: 10,
                enableIdleJitter: true
            }
        }
    };

    const overrides = tierOverrides[tier];

    return {
        ...base,
        scene: {
            ...sharedScene,
            ...tierOverrides.high.scene,
            ...overrides.scene
        },
        hologram: {
            ...tierOverrides.high.hologram,
            ...overrides.hologram
        },
        profile: {
            ...tierOverrides.high.profile,
            ...overrides.profile
        },
        skills: {
            ...tierOverrides.high.skills,
            ...overrides.skills
        },
        services: {
            ...tierOverrides.high.services,
            ...overrides.services
        },
        quote: {
            ...tierOverrides.high.quote,
            ...overrides.quote
        }
    };
}

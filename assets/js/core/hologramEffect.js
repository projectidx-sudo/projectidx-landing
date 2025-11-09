export function createHolographicEffect(targetElement, performanceSettings = {}) {
    if (!targetElement) {
        return;
    }

    const hologramSettings = performanceSettings.hologram ?? {};
    const {
        enabled = true,
        particleCount = 500,
        dynamicJitter = true
    } = hologramSettings;

    if (!enabled || particleCount === 0) {
        targetElement.classList.add('hologram-fallback');
        return;
    }

    targetElement.classList.remove('hologram-fallback');
    const rect = targetElement.getBoundingClientRect();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(rect.width, rect.height);
    renderer.setClearColor(0x000000, 0);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '3';
    container.style.overflow = 'hidden';

    container.appendChild(renderer.domElement);
    targetElement.appendChild(container);

    camera.position.z = 50;

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = particleCount;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const radius = 20 + Math.random() * 30;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 20;

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        colorsArray[i * 3] = 1.0;
        colorsArray[i * 3 + 1] = 0.5 + Math.random() * 0.1;
        colorsArray[i * 3 + 2] = Math.random() * 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    let animationFrameId = null;

    const animate = (timestamp) => {
        animationFrameId = requestAnimationFrame(animate);

        particleSystem.rotation.y += 0.002;
        particleSystem.rotation.z += 0.001;

        if (dynamicJitter) {
            const positions = particlesGeometry.attributes.position.array;
            const time = (timestamp ?? performance.now()) * 0.001;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin(time + i) * 0.02;
                positions[i + 1] += Math.cos(time * 1.3 + i) * 0.01;
                positions[i + 2] += Math.sin(time * 0.8 + i) * 0.02;
            }
            particlesGeometry.attributes.position.needsUpdate = true;
        }
        renderer.render(scene, camera);
    };

    const startAnimation = () => {
        if (animationFrameId === null) {
            animationFrameId = requestAnimationFrame(animate);
        }
    };

    const stopAnimation = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    startAnimation();

    const handleResize = () => {
        const newRect = targetElement.getBoundingClientRect();
        camera.aspect = newRect.width / newRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(newRect.width, newRect.height);
    };

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
}

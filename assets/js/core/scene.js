export function initThreeScene(performanceSettings = {}) {
    const sceneSettings = performanceSettings.scene ?? {};
    const {
        maxPixelRatio = Math.min(window.devicePixelRatio || 1, 2),
        earthSegments = 64,
        starFieldParticleCount = 5000,
        starParticleSize = 0.1,
        randomLineCount = 50,
        autoRotate = true,
        autoRotateSpeed = 0.5,
        mouseParallaxMultiplier = 0.1,
        touchParallaxMultiplier = 0.05,
        digitalNumberRefreshIntervalMs = 0,
        pauseWhenHidden = false,
        gridHelperSize = 100,
        gridHelperDivisions = 100
    } = sceneSettings;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(maxPixelRatio);
    document.body.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;

    camera.position.z = 20;
    camera.position.y = -20;
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x404040, 1));

    const directionalLight = new THREE.DirectionalLight(0xff8c00, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff8c00, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const earthGeometry = new THREE.SphereGeometry(5, earthSegments, earthSegments);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg');
    const earthBumpMap = textureLoader.load('https://threejs.org/examples/textures/earth_normal_2048.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: earthBumpMap,
        bumpScale: 0.05,
        shininess: 5,
        emissive: new THREE.Color(0xff8c00),
        emissiveIntensity: 0.1
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const wireSegments = Math.max(16, Math.floor(earthSegments / 2));
    const wireGeometry = new THREE.SphereGeometry(5.1, wireSegments, wireSegments);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8c00,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireframe);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = starFieldParticleCount;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: starParticleSize,
        color: 0xff8c00,
        transparent: true,
        opacity: 0.8
    });
    const particleMesh = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleMesh);

    if (gridHelperSize > 0 && gridHelperDivisions > 0) {
        const gridHelper = new THREE.GridHelper(gridHelperSize, gridHelperDivisions, 0xff8c00, 0xff8c00);
        gridHelper.position.y = -10;
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
    }

    addRandomLines(scene, randomLineCount);

    const adjustForMobile = () => {
        if (window.innerWidth <= 768) {
            camera.position.z = 30;
            camera.position.y = -30;
            earth.scale.set(0.8, 0.8, 0.8);
            wireframe.scale.set(0.8, 0.8, 0.8);
        } else {
            camera.position.z = 20;
            camera.position.y = -20;
            earth.scale.set(1, 1, 1);
            wireframe.scale.set(1, 1, 1);
        }
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    };

    const updateDigitalNumbers = () => {
        const coordinatesEl = document.getElementById('coordinates');
        const timestampEl = document.getElementById('timestamp');
        if (!coordinatesEl || !timestampEl) return;

        coordinatesEl.textContent = `X: ${camera.position.x.toFixed(2)} Y: ${camera.position.y.toFixed(2)} Z: ${camera.position.z.toFixed(2)}`;

        const now = new Date();
        timestampEl.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    };

    let lastDigitalUpdate = 0;
    let animationFrameId = null;

    const animate = (timestamp) => {
        animationFrameId = requestAnimationFrame(animate);
        earth.rotation.y += 0.001;
        wireframe.rotation.y += 0.001;
        particleMesh.rotation.y += 0.0005;
        if (!digitalNumberRefreshIntervalMs || timestamp - lastDigitalUpdate >= digitalNumberRefreshIntervalMs) {
            updateDigitalNumbers();
            lastDigitalUpdate = timestamp;
        }
        controls.update();
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

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            adjustForMobile();
        }, 100);
    });

    if (mouseParallaxMultiplier > 0) {
        document.addEventListener('mousemove', (event) => {
            if (window.innerWidth > 768) {
                const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                gsap.to(scene.rotation, {
                    x: mouseY * mouseParallaxMultiplier,
                    y: mouseX * mouseParallaxMultiplier,
                    duration: 1
                });
            }
        });
    }

    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;

    if (touchParallaxMultiplier > 0) {
        document.addEventListener('touchstart', (event) => {
            touchStartY = event.touches[0].clientY;
            touchStartX = event.touches[0].clientX;
            isScrolling = false;
        }, { passive: true });

        document.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {
                const touchY = event.touches[0].clientY;
                const touchX = event.touches[0].clientX;
                const deltaY = Math.abs(touchY - touchStartY);
                const deltaX = Math.abs(touchX - touchStartX);

                if (deltaY > deltaX && deltaY > 10) {
                    isScrolling = true;
                }

                if (!isScrolling && window.scrollY < window.innerHeight * 0.8) {
                    const touchXNorm = (touchX / window.innerWidth) * 2 - 1;
                    const touchYNorm = -(touchY / window.innerHeight) * 2 + 1;
                    gsap.to(scene.rotation, {
                        x: touchYNorm * touchParallaxMultiplier,
                        y: touchXNorm * touchParallaxMultiplier,
                        duration: 1
                    });
                }
            }
        }, { passive: true });
    }

    adjustForMobile();
    startAnimation();

    if (pauseWhenHidden) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    }

    return { scene };
}

function addRandomLines(scene, count) {
    const lines = Math.max(0, count);
    for (let i = 0; i < lines; i++) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
            color: 0xff8c00,
            transparent: true,
            opacity: Math.random() * 0.5
        });

        const points = [];
        const startPoint = new THREE.Vector3(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        points.push(startPoint);

        const segments = Math.floor(Math.random() * 5) + 2;
        for (let j = 0; j < segments; j++) {
            points.push(new THREE.Vector3(
                startPoint.x + (Math.random() - 0.5) * 20,
                startPoint.y + (Math.random() - 0.5) * 20,
                startPoint.z + (Math.random() - 0.5) * 20
            ));
        }

        geometry.setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }
}

import { loadComponents } from './core/componentLoader.js';
import { initThreeScene } from './core/scene.js';
import { getPerformanceSettings } from './core/performanceConfig.js';
import { registerNavigationHandlers } from './features/navigation.js';
import { initWhoisPanel } from './features/whoisPanel.js';
import { initProfileAnimation } from './features/profileAnimation.js';
import { initSkillsAnimation } from './features/skillsAnimation.js';
import { initServicesAnimation } from './features/servicesAnimation.js';
import { initInspirationalQuote } from './features/quoteAnimation.js';
import { initPreloader } from './features/preloader.js';

document.addEventListener('DOMContentLoaded', async () => {
    const preloader = initPreloader();
    preloader.setStatus('Initializing system', 18);

    const performanceSettings = getPerformanceSettings();
    preloader.setStatus('Optimizing performance', 32);

    preloader.setStatus('Loading components', 42);
    await loadComponents();

    preloader.setStatus('Building 3D space', 58);
    const startScene = () => initThreeScene(performanceSettings);
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(startScene, { timeout: 500 });
    } else {
        setTimeout(startScene, 0);
    }
    preloader.setStatus('Activating navigation', 70);
    registerNavigationHandlers();
    preloader.setStatus('Synchronizing interface', 78);
    initWhoisPanel();
    initProfileAnimation(performanceSettings);
    initSkillsAnimation(performanceSettings);
    initServicesAnimation(performanceSettings);
    initInspirationalQuote(performanceSettings);
    preloader.setStatus('Launch complete', 92);
    preloader.markComplete();
});

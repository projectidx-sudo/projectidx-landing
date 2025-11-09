const MAX_PROGRESS_BEFORE_READY = 96;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function initPreloader() {
    const preloader = document.getElementById('preloader');

    if (!preloader) {
        return {
            setStatus: () => {},
            markComplete: () => {},
        };
    }

    const progressBar = preloader.querySelector('.preloader__progress-bar');
    const progressContainer = preloader.querySelector('.preloader__progress');
    const statusText = preloader.querySelector('.preloader__status-text');

    document.body.classList.add('preloader-active');
    preloader.setAttribute('aria-busy', 'true');

    let current = 0;
    let target = 12;
    let rafId = null;
    let isFinalising = false;

    const applyProgress = (value) => {
        if (progressBar) {
            progressBar.style.width = `${value}%`;
        }
        if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', String(Math.round(value)));
        }
    };

    const stepAnimation = () => {
        current += (target - current) * 0.18;
        if (Math.abs(target - current) < 0.4) {
            current = target;
        }
        applyProgress(current);

        if (isFinalising && current >= 100) {
            rafId = null;
            return;
        }

        rafId = requestAnimationFrame(stepAnimation);
    };

    const ensureAnimation = () => {
        if (rafId === null) {
            rafId = requestAnimationFrame(stepAnimation);
        }
    };

    ensureAnimation();

    const setStatus = (message, hintProgress) => {
        if (message && statusText) {
            statusText.textContent = message;
        }
        if (isFinalising) {
            return;
        }
        if (typeof hintProgress === 'number' && Number.isFinite(hintProgress)) {
            target = clamp(hintProgress, current, MAX_PROGRESS_BEFORE_READY);
        } else {
            target = clamp(target + 8, current, MAX_PROGRESS_BEFORE_READY);
        }
        ensureAnimation();
    };

    const markComplete = () => {
        if (isFinalising) {
            return;
        }
        isFinalising = true;
        target = 100;
        ensureAnimation();

        preloader.classList.add('preloader--loaded');
        preloader.setAttribute('aria-busy', 'false');

        window.setTimeout(() => {
            document.body.classList.remove('preloader-active');
            preloader.classList.add('preloader--hidden');
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            }, { once: true });
        }, 700);
    };

    return {
        setStatus,
        markComplete,
    };
}

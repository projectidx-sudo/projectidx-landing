export function initAudioManager() {
    const audioElement = document.getElementById('theme-audio');
    
    if (!audioElement) {
        console.warn('Audio element không tìm thấy');
        return;
    }

    audioElement.loop = true;
    audioElement.volume = 0.5;
    
    let hasStartedPlaying = false;
    let interactionListenersAttached = false;
    
    const playAudio = async () => {
        if (hasStartedPlaying) {
            return;
        }

        try {
            if (audioElement.readyState >= 2) {
                await audioElement.play();
                hasStartedPlaying = true;
                removeInteractionListeners();
            } else {
                const playWhenReady = async () => {
                    try {
                        await audioElement.play();
                        hasStartedPlaying = true;
                        removeInteractionListeners();
                    } catch (error) {
                        console.warn('Không thể tự động phát âm thanh:', error);
                        attachInteractionListeners();
                    }
                };
                audioElement.addEventListener('canplaythrough', playWhenReady, { once: true });
            }
        } catch (error) {
            console.warn('Tự động phát âm thanh bị chặn. Đang chờ tương tác từ người dùng...');
            attachInteractionListeners();
        }
    };

    const playOnInteraction = async () => {
        if (hasStartedPlaying) {
            return;
        }

        try {
            await audioElement.play();
            hasStartedPlaying = true;
            removeInteractionListeners();
        } catch (err) {
            console.warn('Vẫn không thể phát âm thanh:', err);
        }
    };

    const attachInteractionListeners = () => {
        if (interactionListenersAttached) {
            return;
        }
        interactionListenersAttached = true;

        const userInteractionEvents = [
            'click',
            'touchstart',
            'touchend',
            'keydown',
            'mousedown',
            'mousemove',
            'wheel',
            'scroll',
            'pointerdown',
            'pointermove'
        ];

        userInteractionEvents.forEach(event => {
            document.addEventListener(event, playOnInteraction, { once: false, passive: true });
        });

        window.addEventListener('scroll', playOnInteraction, { once: false, passive: true });
    };

    const removeInteractionListeners = () => {
        if (!interactionListenersAttached) {
            return;
        }

        const userInteractionEvents = [
            'click',
            'touchstart',
            'touchend',
            'keydown',
            'mousedown',
            'mousemove',
            'wheel',
            'scroll',
            'pointerdown',
            'pointermove'
        ];

        userInteractionEvents.forEach(event => {
            document.removeEventListener(event, playOnInteraction);
        });
        window.removeEventListener('scroll', playOnInteraction);
        
        interactionListenersAttached = false;
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        playAudio();
    } else {
        window.addEventListener('load', playAudio);
    }

    audioElement.addEventListener('error', (e) => {
        console.error('Lỗi khi tải file âm thanh:', e);
    });

    return {
        play: () => audioElement.play(),
        pause: () => audioElement.pause(),
        toggle: () => {
            if (audioElement.paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        },
        setVolume: (volume) => {
            audioElement.volume = Math.max(0, Math.min(1, volume));
        },
        getVolume: () => audioElement.volume
    };
}


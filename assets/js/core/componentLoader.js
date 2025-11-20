async function loadBatch() {
    const placeholders = Array.from(document.querySelectorAll('[data-component-src], [data-component]'))
        .filter((element) => element.dataset.componentSrc || element.dataset.src);

    if (placeholders.length === 0) {
        return false;
    }

    await Promise.all(placeholders.map(async (placeholder) => {
        const src = placeholder.dataset.componentSrc || placeholder.dataset.src;
        if (!src) {
            return;
        }

        try {
            const response = await fetch(src);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
            }
            const html = await response.text();
            placeholder.outerHTML = html;
        } catch (error) {
            console.error(error);
            placeholder.innerHTML = '';
            placeholder.removeAttribute('data-component-src');
            placeholder.removeAttribute('data-component');
            placeholder.removeAttribute('data-src');
        }
    }));

    return true;
}

export async function loadComponents() {
    while (await loadBatch()) {
    }
}

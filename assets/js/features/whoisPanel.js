const WHOIS_ENDPOINT = 'https://whois-api.projectidx.space/';

export function initWhoisPanel() {
    const whoisToggle = document.getElementById('whois-toggle');
    const whoisPanel = document.getElementById('whois-panel');
    const whoisClose = document.getElementById('whois-close');
    const domainInput = document.getElementById('domain-input');
    const lookupBtn = document.getElementById('whois-lookup-btn');
    const resultsDiv = document.getElementById('whois-results');

    if (!whoisToggle || !whoisPanel || !whoisClose || !domainInput || !lookupBtn || !resultsDiv) {
        return;
    }

    whoisToggle.addEventListener('click', () => {
        whoisPanel.classList.toggle('active');
        whoisToggle.classList.toggle('active');
    });

    whoisClose.addEventListener('click', () => {
        whoisPanel.classList.remove('active');
        whoisToggle.classList.remove('active');
    });

    document.addEventListener('click', (event) => {
        if (!whoisPanel.contains(event.target) && !whoisToggle.contains(event.target)) {
            whoisPanel.classList.remove('active');
            whoisToggle.classList.remove('active');
        }
    });

    const performWhoisLookup = async (domain) => {
        try {
            lookupBtn.disabled = true;
            lookupBtn.textContent = 'LOOKING UP...';
            resultsDiv.innerHTML = '<div class="whois-loading">Fetching WHOIS data...</div>';

            const response = await fetch(`${WHOIS_ENDPOINT}${domain}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayWhoisResults(resultsDiv, data);
        } catch (error) {
            console.error('WHOIS lookup error:', error);
            resultsDiv.innerHTML = `
                <div class="whois-error">
                    <strong>Error:</strong> Failed to fetch WHOIS data. Please check the domain name and try again.
                    <br><small>Error details: ${error.message}</small>
                </div>
            `;
        } finally {
            lookupBtn.disabled = false;
            lookupBtn.textContent = 'LOOKUP DOMAIN';
        }
    };

    lookupBtn.addEventListener('click', () => {
        const domain = domainInput.value.trim();
        if (domain) {
            performWhoisLookup(domain);
        } else {
            alert('Please enter a domain name');
        }
    });

    domainInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const domain = domainInput.value.trim();
            if (domain) {
                performWhoisLookup(domain);
            }
        }
    });

    domainInput.addEventListener('blur', () => {
        let domain = domainInput.value.trim();
        domain = domain.replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/.*$/, '');
        domainInput.value = domain;
    });
}

function displayWhoisResults(container, data) {
    let html = '<h3 style="margin-top: 20px;">WHOIS Results</h3>';

    for (const [key, value] of Object.entries(data)) {
        html += '<div class="whois-field">';
        html += `<div class="whois-field-name">${key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>`;

        if (Array.isArray(value)) {
            html += '<div class="whois-array">';
            value.forEach((item) => {
                html += `<div class="whois-array-item">• ${item}</div>`;
            });
            html += '</div>';
        } else if (value === null || value === undefined) {
            html += '<div class="whois-field-value">N/A</div>';
        } else {
            html += `<div class="whois-field-value">${value}</div>`;
        }

        html += '</div>';
    }

    container.innerHTML = html;
}

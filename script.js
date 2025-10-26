// Anti-inspect: Disable right-click, dev tools shortcuts, and detect dev tools
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.shiftKey && e.key === 'I'))) {
        e.preventDefault();
        alert('Inspect disabled by Team Xost!');
    }
});
// Detect dev tools (basic check)
setInterval(() => {
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        alert('Dev tools detected! Closing...');
        window.close();
    }
}, 1000);

async function checkBan() {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value.replace(/[^0-9]/g, '');
    const error = document.getElementById('error');
    const result = document.getElementById('result');
    const loading = document.getElementById('loading');
    const btn = document.getElementById('checkBtn');
    const headerStatus = document.getElementById('headerStatus');

    error.classList.remove('show');
    result.classList.remove('show');

    if (!phone) {
        error.textContent = 'Please enter a phone number';
        error.classList.add('show');
        return;
    }

    if (phone.length < 10 || phone.length > 15) {
        error.textContent = 'Please enter a valid phone number';
        error.classList.add('show');
        return;
    }

    btn.disabled = true;
    loading.classList.add('show');
    headerStatus.textContent = 'CHECKING...';

    try {
        // Updated to call local API instead of external
        const response = await fetch(`/api/checkban.php?numero=${phone}`);
        const data = await response.json();

        displayResult(data, phone);
    } catch (err) {
        error.textContent = 'Failed to check status. Please try again.';
        error.classList.add('show');
        headerStatus.textContent = 'CHECK FAILED';
    } finally {
        btn.disabled = false;
        loading.classList.remove('show');
    }
}

function displayResult(data, phone) {
    const result = document.getElementById('result');
    const headerStatus = document.getElementById('headerStatus');
    const isBanned = data.banido === true;

    const formattedPhone = formatPhone(phone);

    if (isBanned) {
        headerStatus.textContent = 'BANNED BY //⟨ ⚠ MONSTER ⚠ ⟩';
    } else {
        headerStatus.textContent = 'NUMBER IS SAFE ✓';
    }

    let html = `
        <div class="result-card">
            <div class="result-header">
                <div class="result-number">${formattedPhone}</div>
                <div class="result-status ${isBanned ? 'status-banned' : 'status-safe'}">
                    ${isBanned ? 'BANNED' : 'NOT BANNED'}
                </div>
    `;

    if (isBanned) {
        html += `
                <div class="result-message">
                    EVEN GOD CAN'T FORGIVE YOU FOR YOUR SINS<span class="emoji">🕊️🔥</span>
                </div>
        `;
    } else {
        html += `
                <div class="result-message">
                    This number is safe and can be used normally
                </div>
        `;
    }

    html += '</div>';

    if (isBanned && data.detalhes) {
        html += '<div class="result-details">';
        
        if (data.reason) {
            html += `
                <div class="detail-item">
                    <div class="detail-label">Ban Reason</div>
                    <div class="detail-value">${data.reason}</div>
                </div>
            `;
        }

        if (data.detalhes.violation_type) {
            html += `
                <div class="detail-item">
                    <div class="detail-label">Violation Type</div>
                    <div class="detail-value">Type ${data.detalhes.violation_type}</div>
                </div>
            `;
        }

        if (data.detalhes.status) {
            html += `
                <div class="detail-item">
                    <div class="detail-label">Account Status</div>
                    <div class="detail-value">${data.detalhes.status.toUpperCase()}</div>
                </div>
            `;
        }

        if (data.detalhes.in_app_ban_appeal === 1) {
            html += `
                <div class="detail-item">
                    <div class="detail-label">Appeal Status</div>
                    <div class="detail-value">Appeal Available</div>
                </div>
            `;
        }

        html += '</div>';
    }

    html += `
            <div class="action-buttons">
                <button class="btn-secondary" onclick="resetCheck()">CANCEL</button>
                <button class="btn-secondary btn-support" onclick="showSupport()">SUPPORT</button>
            </div>
        </div>
    `;

    result.innerHTML = html;
    result.classList.add('show');
}

function formatPhone(phone) {
    if (phone.length > 10) {
        return '+' + phone.substring(0, 2) + ' ' + phone.substring(2, 5) + '-' + 
               phone.substring(5, 9) + '-' + phone.substring(9);
    }
    return phone;
}

function resetCheck() {
    document.getElementById('result').classList.remove('show');
    document.getElementById('phone').value = '';
    document.getElementById('phone').focus();
    document.getElementById('headerStatus').textContent = 'READY TO CHECK';
}

function showSupport() {
    alert('For support, please contact Team Xost');
}

document.getElementById('phone').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkBan();
    }
});

document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9+\s-]/g, '');
    e.target.value = value;
});

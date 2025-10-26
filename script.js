* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #000;
    color: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 50% 50%, rgba(40, 40, 40, 0.3) 0%, transparent 70%),
        linear-gradient(180deg, #000 0%, #0a0a0a 100%);
    z-index: 0;
}

.background::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(60, 60, 60, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(60px);
}

.container {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 400px;
    background: rgba(20, 20, 20, 0.95);
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
    overflow: hidden;
}

.header {
    text-align: center;
    padding: 30px 20px 20px;
    background: rgba(30, 30, 30, 0.5);
}

.team-name {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
    letter-spacing: 2px;
    font-style: italic;
}

.logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: rgba(50, 50, 50, 0.6);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    border: 2px solid rgba(100, 100, 100, 0.3);
}

.ban-status {
    font-size: 13px;
    color: #888;
    letter-spacing: 1px;
    margin-top: 15px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
}

.content {
    padding: 25px;
}

.input-section {
    margin-bottom: 25px;
}

.input-wrapper {
    position: relative;
    background: rgba(40, 40, 40, 0.8);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(80, 80, 80, 0.3);
}

input {
    width: 100%;
    padding: 16px 15px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
}

input:focus {
    outline: none;
}

input::placeholder {
    color: #555;
}

.btn-primary {
    width: 100%;
    padding: 16px;
    background: rgba(60, 60, 60, 0.8);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-primary:hover {
    background: rgba(70, 70, 70, 0.9);
}

.btn-primary:active {
    transform: scale(0.98);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.result {
    margin-top: 25px;
    display: none;
    animation: slideIn 0.4s ease-out;
}

.result.show {
    display: block;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.result-card {
    background: rgba(30, 30, 30, 0.8);
    border-radius: 15px;
    padding: 25px;
    border: 1px solid rgba(80, 80, 80, 0.3);
}

.result-header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(80, 80, 80, 0.3);
}

.result-number {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 15px;
    letter-spacing: 1px;
}

.result-status {
    font-size: 15px;
    letter-spacing: 2px;
    margin-bottom: 20px;
    padding: 8px 15px;
    border-radius: 8px;
    display: inline-block;
}

.status-banned {
    color: #ff4444;
    background: rgba(255, 68, 68, 0.15);
}

.status-safe {
    color: #44ff44;
    background: rgba(68, 255, 68, 0.15);
}

.result-message {
    font-size: 14px;
    line-height: 1.6;
    color: #aaa;
    text-align: center;
    margin-top: 10px;
}

.result-details {
    margin-top: 20px;
}

.detail-item {
    padding: 15px 0;
    border-bottom: 1px solid rgba(80, 80, 80, 0.2);
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
}

.detail-value {
    font-size: 14px;
    color: #fff;
    font-weight: 500;
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.btn-secondary {
    flex: 1;
    padding: 14px;
    background: rgba(50, 50, 50, 0.6);
    border: 1px solid rgba(80, 80, 80, 0.3);
    border-radius: 10px;
    color: #ccc;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-secondary:hover {
    background: rgba(60, 60, 60, 0.8);
    color: #fff;
}

.btn-support {
    background: rgba(255, 68, 68, 0.2);
    border-color: rgba(255, 68, 68, 0.3);
    color: #ff4444;
}

.btn-support:hover {
    background: rgba(255, 68, 68, 0.3);
}

.loading {
    text-align: center;
    padding: 20px;
    display: none;
}

.loading.show {
    display: block;
}

.spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 15px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #666;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    color: #888;
    font-size: 14px;
}

.error {
    color: #ff4444;
    font-size: 13px;
    margin-top: 10px;
    text-align: center;
    display: none;
}

.error.show {
    display: block;
}

.emoji {
    font-size: 20px;
    margin-left: 5px;
}

.footer {
    position: relative;
    z-index: 10;
    margin-top: 20px;
    text-align: center;
    color: #444;
    font-size: 11px;
}

/**
 * I Hate JS I hate JS I hate JS I hate JS
 *
 * Spent an hour fixing this... to realize this class was never broken
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Dashboard location path
     */
    const DASHBOARD_PATH = "../Dashboard/Dashboard.html";

    /**
     * Login service instance
     */
    const loginService = new LoginService();

    /**
     * Initialize page and set up event handlers
     */
    function init() {
        if (loginService.isLoggedIn()) {
            window.location.href = DASHBOARD_PATH;
            return;
        }

        setupFormHandlers();
        setupDebugHelpers();
        checkBackendStatus();
    }

    /**
     * Check if backend server is available
     */
    function checkBackendStatus() {
        const securityBadge = document.querySelector('.security-badge');

        fetch(`${loginService.apiBaseUrl}/wallet/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            cache: 'no-cache'
        })
            .then(response => {
                if (response.ok) {
                    securityBadge.innerHTML = '<i class="fas fa-shield-alt"></i>' +
                        '<span>Server online - Ready</span>';
                    securityBadge.classList.add('server-online');
                } else {
                    securityBadge.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i>' +
                        '<span>Server status: Warning</span>';
                    securityBadge.classList.add('server-warning');
                }
            })
            .catch(() => {
                securityBadge.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: var(--warning);"></i>' +
                    '<span>Server offline</span>';
                securityBadge.classList.add('server-offline');
            });
    }

    /**
     * Set up form event handlers
     */
    function setupFormHandlers() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }

        const togglePassword = document.querySelector('.toggle-password');
        if (togglePassword) {
            togglePassword.addEventListener('click', togglePasswordVisibility);
        }
    }

    /**
     * Handle login form submission
     */
    function handleLoginSubmit(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.querySelector('.login-btn');

        loginBtn.classList.add('loading');
        loginBtn.innerHTML = '<span>Authenticating...</span>';

        if (window.debugLog) {
            debugLog(`Login attempt: ${username}`);
        }

        loginService.login(username, password)
            .then(result => {
                if (result.success) {
                    handleSuccessfulLogin(loginBtn, result.userData);
                } else {
                    handleFailedLogin(loginBtn, result.message);
                }
            })
            .catch(error => {
                handleFailedLogin(loginBtn, `Error: ${error.message}`);
            });
    }

    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    }

    /**
     * Handle successful login
     */
    function handleSuccessfulLogin(button, userData) {
        const loginForm = document.getElementById('loginForm');

        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '<span>Success!</span> <i class="fas fa-check"></i>';

        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Login successful! Redirecting...';
        loginForm.appendChild(successMsg);

        if (window.debugLog) {
            debugLog(`Login successful for user: ${userData.username}`);
        }

        setTimeout(function() {
            window.location.href = DASHBOARD_PATH;
        }, 1500);
    }

    /**
     * Handle failed login
     */
    function handleFailedLogin(button, errorMessage) {
        const loginForm = document.getElementById('loginForm');

        button.classList.remove('loading');
        button.innerHTML = '<span>Login Securely</span> <i class="fas fa-arrow-right"></i>';

        if (window.debugLog) {
            debugLog(`Login failed: ${errorMessage}`);
        }

        showError(loginForm, errorMessage);
    }

    /**
     * Displays error message in the form
     */
    function showError(form, message) {
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    }

    // Additional debug helper functions

    /**
     * Set up debugging helpers
     */
    function setupDebugHelpers() {
        const securityBadge = document.querySelector('.security-badge');
        if (securityBadge) {
            securityBadge.addEventListener('dblclick', function() {
                const debugDiv = document.getElementById('debugPanel');
                if (debugDiv) {
                    debugDiv.remove();
                    return;
                }

                const logDiv = document.createElement('div');
                logDiv.id = 'debugPanel';
                logDiv.style.position = 'fixed';
                logDiv.style.top = '10px';
                logDiv.style.right = '10px';
                logDiv.style.backgroundColor = '#000a';
                logDiv.style.color = '#fff';
                logDiv.style.padding = '10px';
                logDiv.style.borderRadius = '5px';
                logDiv.style.maxWidth = '400px';
                logDiv.style.maxHeight = '300px';
                logDiv.style.overflow = 'auto';
                logDiv.style.zIndex = '9999';
                logDiv.style.fontSize = '12px';
                logDiv.style.fontFamily = 'monospace';

                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'X';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '5px';
                closeBtn.style.right = '5px';
                closeBtn.style.background = 'transparent';
                closeBtn.style.border = 'none';
                closeBtn.style.color = '#fff';
                closeBtn.style.cursor = 'pointer';
                closeBtn.onclick = () => logDiv.remove();
                logDiv.appendChild(closeBtn);

                const logContent = document.createElement('div');
                logContent.id = 'debugLog';
                logDiv.appendChild(logContent);

                const fillCredentialsBtn = document.createElement('button');
                fillCredentialsBtn.innerText = 'Fill Jim/Lee Credentials';
                fillCredentialsBtn.style.width = '100%';
                fillCredentialsBtn.style.marginTop = '5px';
                fillCredentialsBtn.style.padding = '5px';
                fillCredentialsBtn.onclick = function() {
                    document.getElementById('username').value = 'jim';
                    document.getElementById('password').value = 'lee';
                    debugLog('Test credentials filled');
                };
                logDiv.appendChild(fillCredentialsBtn);

                const fillJohnBtn = document.createElement('button');
                fillJohnBtn.innerText = 'Fill John/Doe Credentials';
                fillJohnBtn.style.width = '100%';
                fillJohnBtn.style.marginTop = '5px';
                fillJohnBtn.style.padding = '5px';
                fillJohnBtn.onclick = function() {
                    document.getElementById('username').value = 'john';
                    document.getElementById('password').value = 'doe';
                    debugLog('John credentials filled');
                };
                logDiv.appendChild(fillJohnBtn);

                document.body.appendChild(logDiv);

                debugLog('Debug panel activated');
                debugLog('Current time: ' + new Date().toISOString());
            });
        }

        window.debugLog = function(message) {
            console.log(`[DEBUG] ${message}`);
            const log = document.getElementById('debugLog');
            if (log) {
                const entry = document.createElement('div');
                entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
                log.appendChild(entry);
                log.scrollTop = log.scrollHeight;
            }
        };
    }

    init();
});
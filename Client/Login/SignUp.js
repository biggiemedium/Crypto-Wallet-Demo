/**
 * JavaScript for Sign-Up page functionality
 * Manages user registration and Stellar wallet creation
 *
 * @author James
 */
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const apiBaseUrl = 'http://localhost:8081/api';

    /**
     * Initialize the sign up page
     */
    function init() {
        if (signupForm) {
            signupForm.addEventListener('submit', handleSignUp);
        }

        document.getElementById('goToLogin').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Login.html';
        });

        // Set current date in the footer
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = '2025-05-16 14:30:47';
        }
    }

    /**
     * Handle the sign up form submission
     */
    async function handleSignUp(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Clear previous error
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Validate input
        if (!username || !password) {
            showError('Username and password are required');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';
        submitButton.classList.add('loading');

        try {
            // Call API to create account
            const response = await fetch(`${apiBaseUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store authentication data
                sessionStorage.setItem('authenticated', 'true');
                sessionStorage.setItem('currentUser', data.username);
                sessionStorage.setItem('walletAddress', data.walletAddress);

                // Show success message
                showSuccess('Account created successfully! Redirecting to dashboard...');

                // Redirect to dashboard after a brief delay
                setTimeout(() => {
                    window.location.href = '../Dashboard/Dashboard.html';
                }, 1500);
            } else {
                showError(data.message || 'Failed to create account');
            }
        } catch (error) {
            showError('Error connecting to server: ' + error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.classList.remove('loading');
        }
    }

    /**
     * Show an error message
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.className = 'error-message';
    }

    /**
     * Show a success message
     */
    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.className = 'success-message';
    }

    init();
});
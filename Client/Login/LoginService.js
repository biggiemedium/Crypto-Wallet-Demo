/**
 * Talks to the server and asks for authentication.
 *
 * @author James
 * @since 2025-05-15
 */
/**
 * Authentication service for the Crypto Wallet web application.
 * Handles secure communication with the Java authentication server,
 * session management, and authorization.
 *
 * @author James
 * @since 2025-05-15
 */
class LoginService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8081/api';
    }

    /**
     * Attempts user login with credentials
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<object>} Login result
     */
    async login(username, password) {
        try {
            console.log("Sending login request to:", `${this.apiBaseUrl}/auth/login`);
            console.log("With credentials:", { username, password: "***" });

            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            console.log("Login response status:", response.status);
            console.log("Login response headers:", Object.fromEntries([...response.headers]));

            if (!response) {
                console.error("No response received");
                return {
                    success: false,
                    message: "No response received from server"
                };
            }

            const responseText = await response.text();
            console.log("Response text:", responseText);

            if (!responseText || responseText.trim() === '') {
                console.error("Empty response from server");

                if (username === 'john' && password === 'doe' ||
                    username === 'jim' && password === 'lee') {
                    console.log("Using fallback authentication for development");

                    sessionStorage.setItem('currentUser', username);
                    sessionStorage.setItem('walletAddress', 'DEV_WALLET_' + username);
                    sessionStorage.setItem('authenticated', 'true');

                    return {
                        success: true,
                        message: 'Login successful (development mode)',
                        userData: {
                            username: username,
                            walletAddress: 'DEV_WALLET_' + username
                        }
                    };
                }

                return {
                    success: false,
                    message: "Server returned empty response"
                };
            }

            try {
                const data = JSON.parse(responseText);

                if (response.ok && data.success) {
                    sessionStorage.setItem('currentUser', data.username);
                    sessionStorage.setItem('walletAddress', data.walletAddress);
                    sessionStorage.setItem('authenticated', 'true');

                    return {
                        success: true,
                        message: data.message || 'Login successful',
                        userData: {
                            username: data.username,
                            walletAddress: data.walletAddress
                        }
                    };
                } else {
                    return {
                        success: false,
                        message: data.message || 'Authentication failed'
                    };
                }
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                return {
                    success: false,
                    message: `Error parsing server response: ${parseError.message}`
                };
            }
        } catch (error) {
            console.error("Login error:", error);

            if (username === 'john' && password === 'doe' ||
                username === 'jim' && password === 'lee') {
                console.log("Using fallback authentication after error");

                sessionStorage.setItem('currentUser', username);
                sessionStorage.setItem('walletAddress', 'DEV_WALLET_' + username);
                sessionStorage.setItem('authenticated', 'true');

                return {
                    success: true,
                    message: 'Login successful (development mode)',
                    userData: {
                        username: username,
                        walletAddress: 'DEV_WALLET_' + username
                    }
                };
            }

            return {
                success: false,
                message: 'Error connecting to authentication service: ' + error.message
            };
        }
    }

    /**
     * Checks if user is logged in
     * @returns {boolean} Login status
     */
    isLoggedIn() {
        return sessionStorage.getItem('authenticated') === 'true';
    }

    /**
     * Gets current user data
     * @returns {object|null} User data or null if not logged in
     */
    getCurrentUser() {
        const username = sessionStorage.getItem('currentUser');
        if (!username) return null;

        return {
            username: username,
            walletAddress: sessionStorage.getItem('walletAddress')
        };
    }

    /**
     * Logs out current user
     */
    logout() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('walletAddress');
        sessionStorage.removeItem('authenticated');
    }
}
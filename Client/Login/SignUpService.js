/**
 * SignupService.js
 * Handles sign-up functionality and communication with backend API
 *
 * @author James
 */

class SignupService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8081/api';
    }

    /**
     * Registers a new user with the backend service
     * @param {string} username - The chosen username
     * @param {string} password - The chosen password
     * @returns {Promise<Object>} - Response from the server
     */
    async register(username, password) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/signup`, {
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

            const responseText = await response.text();

            if (!responseText || responseText.trim() === '') {
                console.error("Server returned empty response");
                return {
                    success: false,
                    message: "Server returned empty response"
                };
            }

            try {
                const data = JSON.parse(responseText);
                return data;
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                return {
                    success: false,
                    message: `Error parsing server response: ${parseError.message}`
                };
            }
        } catch (error) {
            console.error("Registration error:", error);
            return {
                success: false,
                message: 'Error connecting to registration service: ' + error.message
            };
        }
    }
}
package dev.wallet.backend.Constructors;

/**
 * Request object for user sign-up
 */
public class SignUpRequest {
    private String username;
    private String password;

    /**
     * Get the username
     * @return The username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Set the username
     * @param username The username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Get the password
     * @return The password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Set the password
     * @param password The password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
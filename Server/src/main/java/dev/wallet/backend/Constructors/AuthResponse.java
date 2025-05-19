package dev.wallet.backend.Constructors;

/**
 * Response model for authentication results
 */
public class AuthResponse {
    private boolean success;
    private String message;
    private String username;
    private String walletAddress;
    private String errorCode;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, String username, String walletAddress, String errorCode) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.walletAddress = walletAddress;
        this.errorCode = errorCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getWalletAddress() {
        return walletAddress;
    }

    public void setWalletAddress(String walletAddress) {
        this.walletAddress = walletAddress;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
}

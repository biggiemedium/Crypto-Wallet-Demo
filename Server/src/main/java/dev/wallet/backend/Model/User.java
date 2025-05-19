package dev.wallet.backend.Model;

import java.util.Objects;

/**
 * User entity representing an authenticated wallet user
 */
public class User {
    private String username;
    private String password;
    private String stellarPublicKey;
    private String stellarSecretKey;

    public User() {
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStellarPublicKey() {
        return stellarPublicKey;
    }

    public void setStellarPublicKey(String stellarPublicKey) {
        this.stellarPublicKey = stellarPublicKey;
    }

    public String getStellarSecretKey() {
        return stellarSecretKey;
    }

    public void setStellarSecretKey(String stellarSecretKey) {
        this.stellarSecretKey = stellarSecretKey;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}

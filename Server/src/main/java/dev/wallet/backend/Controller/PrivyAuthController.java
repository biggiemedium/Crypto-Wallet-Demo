package dev.wallet.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.wallet.backend.Constructors.AuthResponse;
import dev.wallet.backend.Model.User;
import dev.wallet.backend.Service.PrivyService;

/**
 * Controller for Privy authentication operations
 */
@RestController
@RequestMapping("/api/privy")
public class PrivyAuthController {

    private final PrivyService privyService;

    @Autowired
    public PrivyAuthController(PrivyService privyService) {
        this.privyService = privyService;
    }

    /**
     * Verifies a Privy auth token and returns user info
     */
    @PostMapping("/auth")
    public ResponseEntity<AuthResponse> authenticateWithPrivy(@RequestBody PrivyAuthRequest request) {
        User user = privyService.verifyToken(request.getToken());

        if (user != null) {
            return ResponseEntity.ok(new AuthResponse(
                    true,
                    "Privy authentication successful",
                    user.getUsername(),
                    user.getStellarPublicKey(),
                    null
            ));
        } else {
            return ResponseEntity.status(401).body(new AuthResponse(
                    false,
                    "Invalid Privy token",
                    null,
                    null,
                    "PRIVY_AUTH_FAILED"
            ));
        }
    }

    /**
     * Links a new Stellar wallet to a Privy user
     */
    @PostMapping("/link-wallet")
    public ResponseEntity<?> linkWallet(@RequestBody PrivyLinkWalletRequest request) {
        var result = privyService.linkStellarWallet(request.getUserId());

        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body("{\"success\":false,\"message\":\"Failed to link wallet\"}");
        }
    }
}

/**
 * Request object for Privy authentication
 */
class PrivyAuthRequest {
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

/**
 * Request object for linking a wallet
 */
class PrivyLinkWalletRequest {
    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
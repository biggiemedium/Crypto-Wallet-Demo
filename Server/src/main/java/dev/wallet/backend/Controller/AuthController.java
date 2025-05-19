package dev.wallet.backend.Controller;

import dev.wallet.backend.Constructors.AuthRequest;
import dev.wallet.backend.Constructors.AuthResponse;
import dev.wallet.backend.Model.User;
import dev.wallet.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication operations
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Authenticates a user and returns session details
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        User user = userService.authenticate(request.getUsername(), request.getPassword());

        if (user != null) {
            return ResponseEntity.ok(new AuthResponse(
                    true,
                    "Login successful",
                    user.getUsername(),
                    user.getStellarPublicKey(),
                    null
            ));
        } else {
            return ResponseEntity.status(401).body(new AuthResponse(
                    false,
                    "Invalid username or password",
                    null,
                    null,
                    "AUTHENTICATION_FAILED"
            ));
        }
    }
}

package dev.wallet.backend.Controller;

import dev.wallet.backend.Constructors.AuthResponse;
import dev.wallet.backend.Constructors.SignUpRequest;
import dev.wallet.backend.Model.User;
import dev.wallet.backend.Service.StellarService;
import dev.wallet.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Controller for user registration functionality
 */
@RestController
@RequestMapping("/api/signup")
public class SignUpController {

    private final UserService userService;
    private final StellarService stellarService;

    @Autowired
    public SignUpController(UserService userService, StellarService stellarService) {
        this.userService = userService;
        this.stellarService = stellarService;
    }

    /**
     * Register a new user and create a Stellar wallet
     */
    @PostMapping
    public ResponseEntity<AuthResponse> signUp(@RequestBody SignUpRequest request) {
        try {
            /**
             * Check if username is already taken
             */
            if (userService.getUser(request.getUsername()) != null) {
                return ResponseEntity.badRequest().body(new AuthResponse(
                        false,
                        "Username already taken",
                        null,
                        null,
                        "USERNAME_TAKEN"
                ));
            }

            /**
             * Generate a new Stellar wallet
             */
            var walletResponse = stellarService.generateWallet();

            /**
             * Create new user
             */
            User newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setPassword(request.getPassword());
            newUser.setStellarPublicKey(walletResponse.getPublicKey());
            newUser.setStellarSecretKey(walletResponse.getSecretKey());

            /**
             * Add user to service
             */
            userService.addUser(newUser);

            /**
             * Save user data to local file
             */
            saveUserToFile(newUser);

            /**
             * Return successful response
             */
            return ResponseEntity.ok(new AuthResponse(
                    true,
                    "Account created successfully",
                    newUser.getUsername(),
                    newUser.getStellarPublicKey(),
                    null
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new AuthResponse(
                    false,
                    "Error creating account: " + e.getMessage(),
                    null,
                    null,
                    "SIGNUP_ERROR"
            ));
        }
    }

    /**
     * Save user data to local file system
     * @param user User to save
     * @throws IOException If file operations fail
     */
    private void saveUserToFile(User user) throws IOException {
        /**
         * Create data directory if it doesn't exist
         */
        Path dataDir = Paths.get("./data");
        if (!Files.exists(dataDir)) {
            Files.createDirectories(dataDir);
        }

        /**
         * Write user data to users.txt file in JSON format
         */
        try (FileWriter writer = new FileWriter("./data/users.txt", true)) {
            String userData = String.format(
                    "{\"username\":\"%s\",\"password\":\"%s\",\"stellarPublicKey\":\"%s\",\"stellarSecretKey\":\"%s\"}\n",
                    user.getUsername(), user.getPassword(), user.getStellarPublicKey(), user.getStellarSecretKey());
            writer.write(userData);
        }
    }
}
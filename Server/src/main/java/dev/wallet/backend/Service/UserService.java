package dev.wallet.backend.Service;

import dev.wallet.backend.Model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for user management and authentication
 */
@Service
public class UserService {

    private final Map<String, User> users = new HashMap<>();
    private final StellarService stellarService;

    public UserService(StellarService stellarService) {
        this.stellarService = stellarService;
    }

    /**
     * Initialize demo users and load users from file if exists
     */
    @PostConstruct
    public void init() {
        System.out.println("Initializing demo users");
        addDemoUser("john", "doe");
        addDemoUser("jim", "lee");
        addDemoUser("biggiemedium", "password123");

        // Debug the file path
        try {
            Path filePath = Paths.get("./data/users.txt").toAbsolutePath();
            System.out.println("Looking for users file at: " + filePath);

            if (Files.exists(filePath)) {
                System.out.println("Found users.txt file, loading users...");
                List<String> lines = Files.readAllLines(filePath);
                System.out.println("Read " + lines.size() + " lines from users.txt");

                for (String line : lines) {
                    try {
                        System.out.println("Processing line: " + line);
                        if (line.trim().isEmpty()) {
                            System.out.println("Skipping empty line");
                            continue;
                        }

                        String username = line.split("\"username\":\"")[1].split("\"")[0];
                        String password = line.split("\"password\":\"")[1].split("\"")[0];
                        String publicKey = line.split("\"stellarPublicKey\":\"")[1].split("\"")[0];
                        String secretKey = line.split("\"stellarSecretKey\":\"")[1].split("\"")[0];

                        User user = new User();
                        user.setUsername(username);
                        user.setPassword(password);
                        user.setStellarPublicKey(publicKey);
                        user.setStellarSecretKey(secretKey);

                        users.put(username, user);
                        System.out.println("Successfully loaded user from file: " + username);
                    } catch (Exception e) {
                        System.err.println("Error parsing user from line: " + line);
                        System.err.println("Error details: " + e.getMessage());
                    }
                }
            } else {
                System.out.println("users.txt file not found, will create it when new users register");
            }
        } catch (Exception e) {
            System.err.println("Error loading users from file: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Add a demo user with a predefined password
     */
    private void addDemoUser(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        try {
            var wallet = stellarService.generateWallet();
            user.setStellarPublicKey(wallet.getPublicKey());
            user.setStellarSecretKey(wallet.getSecretKey());
            System.out.println("Created demo user: " + username + " with wallet: " + wallet.getPublicKey());
        } catch (Exception e) {
            System.err.println("Error creating wallet for demo user: " + username);
            System.err.println(e.getMessage());
            user.setStellarPublicKey("DEMO_WALLET_" + username);
            user.setStellarSecretKey("DEMO_KEY_" + username);
        }

        users.put(username, user);
    }

    /**
     * Add a new user to the system
     * @param user The user to add
     */
    public void addUser(User user) {
        users.put(user.getUsername(), user);
        System.out.println("Added new user: " + user.getUsername());
    }

    /**
     * Add a Privy-authenticated user
     * @param user The user to add
     */
    public void addPrivyUser(User user) {
        users.put(user.getUsername(), user);
        System.out.println("Added Privy user: " + user.getUsername());
    }

    /**
     * Authenticate a user by username and password
     */
    public User authenticate(String username, String password) {
        System.out.println("Authentication attempt for user: " + username);
        User user = users.get(username);

        if (user != null) {
            System.out.println("User found, comparing passwords");
            if (user.getPassword().equals(password)) {
                System.out.println("Authentication successful for " + username);
                return user;
            }
            System.out.println("Password mismatch for user " + username);
        } else {
            System.out.println("User not found: " + username);
        }

        return null;
    }

    /**
     * Get user by username
     */
    public User getUser(String username) {
        return users.get(username);
    }
}
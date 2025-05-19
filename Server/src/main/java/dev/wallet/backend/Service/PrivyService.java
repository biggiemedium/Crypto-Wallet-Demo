package dev.wallet.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import dev.wallet.backend.Constructors.AuthResponse;
import dev.wallet.backend.Model.User;

/**
 * Service for integrating with Privy authentication and wallet management
 */
@Service
public class PrivyService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final StellarService stellarService;

    @Value("${privy.api.key}")
    private String privyApiKey;

    @Value("${privy.api.url}")
    private String privyApiUrl;

    /**
     * Constructor with dependencies
     */
    public PrivyService(UserService userService, StellarService stellarService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.userService = userService;
        this.stellarService = stellarService;
    }

    /**
     * Verify a Privy authentication token
     *
     * @param token The Privy auth token to verify
     * @return User details if token is valid
     */
    public User verifyToken(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + privyApiKey);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    privyApiUrl + "/auth/verify?token=" + token,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String userId = root.get("user_id").asText();
                String walletAddress = root.path("wallet").path("address").asText("");

                /* Check if user exists in our system */
                User user = userService.getUser(userId);
                if (user == null) {
                    /* Create new user with Privy wallet info */
                    user = new User();
                    user.setUsername(userId);
                    user.setPassword("privy-auth"); /* Not used for Privy auth */
                    user.setStellarPublicKey(walletAddress);

                    /* Add to user service */
                    userService.addPrivyUser(user);
                }

                return user;
            }

            return null;
        } catch (Exception e) {
            System.err.println("Error verifying Privy token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Link a Stellar wallet to a Privy user
     *
     * @param userId Privy user ID
     * @return Wallet information
     */
    public JsonNode linkStellarWallet(String userId) {
        try {
            /* Generate a new Stellar wallet */
            var wallet = stellarService.generateWallet();

            /* Now link this wallet to the Privy account */
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + privyApiKey);
            headers.set("Content-Type", "application/json");

            String requestBody = "{\"user_id\":\"" + userId + "\", " +
                    "\"wallet_type\":\"stellar\", " +
                    "\"address\":\"" + wallet.getPublicKey() + "\", " +
                    "\"private_key\":\"" + wallet.getSecretKey() + "\"}";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    privyApiUrl + "/wallets/link",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                /* Update the user in our database */
                User user = userService.getUser(userId);
                if (user != null) {
                    user.setStellarPublicKey(wallet.getPublicKey());
                    user.setStellarSecretKey(wallet.getSecretKey());
                }

                return objectMapper.readTree(response.getBody());
            }

            return null;
        } catch (Exception e) {
            System.err.println("Error linking Stellar wallet: " + e.getMessage());
            return null;
        }
    }
}

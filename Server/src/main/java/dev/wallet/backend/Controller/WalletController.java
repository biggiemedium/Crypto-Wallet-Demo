package dev.wallet.backend.Controller;

import dev.wallet.backend.Constructors.TransactionRequest;
import dev.wallet.backend.Service.StellarService;
import dev.wallet.backend.Constructors.WalletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for wallet-related operations
 */
@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final StellarService stellarService;

    @Autowired
    public WalletController(StellarService stellarService) {
        this.stellarService = stellarService;
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("{\"status\":\"ok\",\"message\":\"Wallet API is running\"}");
    }

    /**
     * Generates a new Stellar wallet
     */
    @PostMapping("/generate")
    public ResponseEntity<WalletResponse> generateWallet() {
        return ResponseEntity.ok(stellarService.generateWallet());
    }

    /**
     * Gets balance for a given wallet address
     */
    @GetMapping("/balance/{address}")
    public ResponseEntity<WalletResponse> getBalance(@PathVariable String address) {
        return ResponseEntity.ok(stellarService.getBalance(address));
    }

    /**
     * Sends a payment transaction
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendPayment(@RequestBody TransactionRequest request) {
        String transactionId = stellarService.sendPayment(
                request.getSourceSecretKey(),
                request.getDestinationAddress(),
                request.getAmount()
        );
        return ResponseEntity.ok(transactionId);
    }


}
package dev.wallet.backend.Service;

import dev.wallet.backend.Constructors.WalletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.stellar.sdk.*;
import org.stellar.sdk.responses.AccountResponse;
import org.stellar.sdk.responses.SubmitTransactionResponse;
import org.stellar.sdk.responses.operations.OperationResponse;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for interacting with the Stellar blockchain network.
 */
@Service
public class StellarService {

    @Value("${stellar.network}")
    private String networkType;

    @Value("${stellar.horizon-url}")
    private String horizonUrl;

    /**
     * Generates a new random Stellar wallet.
     */
    public WalletResponse generateWallet() {
        KeyPair keyPair = KeyPair.random();
        String publicKey = keyPair.getAccountId();
        String secretKey = String.valueOf(keyPair.getSecretSeed());

        return new WalletResponse(publicKey, secretKey, BigDecimal.ZERO, new HashMap<>());
    }

    /**
     * Gets balance information for a Stellar account.
     * @see Server
     */
    public WalletResponse getBalance(String address) {
        Server server = new Server(horizonUrl);

        try {
            AccountResponse account = server.accounts().account(address);

            BigDecimal nativeBalance = BigDecimal.ZERO;
            Map<String, BigDecimal> assetBalances = new HashMap<>();

            for (AccountResponse.Balance balance : account.getBalances()) {
                if (balance.getAssetType().equals("native")) {
                    nativeBalance = new BigDecimal(balance.getBalance());
                } else {
                    String assetKey = balance.getAssetCode() + ":" + balance.getAssetIssuer();
                    assetBalances.put(assetKey, new BigDecimal(balance.getBalance()));
                }
            }

            return new WalletResponse(address, null, nativeBalance, assetBalances);
        } catch (IOException e) {
            throw new RuntimeException("Failed to fetch account balance", e);
        }
    }

    /**
     * Sends a payment from one account to another.
     */
    public String sendPayment(String sourceSecretKey, String destinationAddress, BigDecimal amount) {
        Server server = new Server(horizonUrl);
        KeyPair sourceKeyPair = KeyPair.fromSecretSeed(sourceSecretKey);

        try {
            Network network = networkType.equals("PUBLIC") ?
                    Network.PUBLIC : Network.TESTNET;

            AccountResponse sourceAccount = server.accounts().account(sourceKeyPair.getAccountId());

            Transaction transaction = new Transaction.Builder(sourceAccount, network)
                    .addOperation(new PaymentOperation.Builder(
                            destinationAddress,
                            new AssetTypeNative(),
                            amount.toString())
                            .build())
                    .setTimeout(180)
                    .build();

            transaction.sign(sourceKeyPair);

            SubmitTransactionResponse response = server.submitTransaction(transaction);

            if (!response.isSuccess()) {
                throw new RuntimeException("Transaction failed: " +
                        response.getExtras().getResultCodes().getOperationsResultCodes());
            }

            return response.getHash();
        } catch (IOException | AccountRequiresMemoException e) {
            throw new RuntimeException("Failed to send payment", e);
        }
    }
    public boolean isTestnet() {
        return !networkType.equals("PUBLIC");
    }


}

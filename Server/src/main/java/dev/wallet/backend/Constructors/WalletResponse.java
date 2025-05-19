package dev.wallet.backend.Constructors;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Data transfer object for wallet information.
 */
public class WalletResponse {
    private final String publicKey;
    private final String secretKey;
    private final BigDecimal xlmBalance;
    private final Map<String, BigDecimal> assetBalances;

    public WalletResponse(String publicKey, String secretKey, BigDecimal xlmBalance,
                          Map<String, BigDecimal> assetBalances) {
        this.publicKey = publicKey;
        this.secretKey = secretKey;
        this.xlmBalance = xlmBalance;
        this.assetBalances = assetBalances;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public BigDecimal getXlmBalance() {
        return xlmBalance;
    }

    public Map<String, BigDecimal> getAssetBalances() {
        return assetBalances;
    }
}

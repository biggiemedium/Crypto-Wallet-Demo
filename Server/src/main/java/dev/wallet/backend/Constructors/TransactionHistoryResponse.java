package dev.wallet.backend.Constructors;

import java.time.Instant;
import java.math.BigDecimal;

/**
 * Data transfer object for transaction history responses.
 * Contains details about a single transaction in the history.
 */
public class TransactionHistoryResponse {
    private final String transactionHash;
    private final Instant createdAt;
    private final BigDecimal amount;
    private final String assetType;
    private final String assetCode;
    private final String assetIssuer;
    private final String fromAddress;
    private final String toAddress;
    private final String memo;
    private final boolean successful;

    public TransactionHistoryResponse(String transactionHash, 
                                    Instant createdAt, 
                                    BigDecimal amount, 
                                    String assetType,
                                    String assetCode,
                                    String assetIssuer,
                                    String fromAddress, 
                                    String toAddress,
                                    String memo,
                                    boolean successful) {
        this.transactionHash = transactionHash;
        this.createdAt = createdAt;
        this.amount = amount;
        this.assetType = assetType;
        this.assetCode = assetCode;
        this.assetIssuer = assetIssuer;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.memo = memo;
        this.successful = successful;
    }

    // Getters
    public String getTransactionHash() {
        return transactionHash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getAssetType() {
        return assetType;
    }

    public String getAssetCode() {
        return assetCode;
    }

    public String getAssetIssuer() {
        return assetIssuer;
    }

    public String getFromAddress() {
        return fromAddress;
    }

    public String getToAddress() {
        return toAddress;
    }

    public String getMemo() {
        return memo;
    }

    public boolean isSuccessful() {
        return successful;
    }

    @Override
    public String toString() {
        return "TransactionHistoryResponse{" +
                "transactionHash='" + transactionHash + '\'' +
                ", createdAt=" + createdAt +
                ", amount=" + amount +
                ", assetType='" + assetType + '\'' +
                ", assetCode='" + assetCode + '\'' +
                ", assetIssuer='" + assetIssuer + '\'' +
                ", fromAddress='" + fromAddress + '\'' +
                ", toAddress='" + toAddress + '\'' +
                ", memo='" + memo + '\'' +
                ", successful=" + successful +
                '}';
    }
}
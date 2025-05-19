package dev.wallet.backend.Constructors;

import java.math.BigDecimal;

/**
 * Data transfer object for transaction requests.
 */
public class TransactionRequest {
    private String sourceSecretKey;
    private String destinationAddress;
    private BigDecimal amount;

    public TransactionRequest() {
    }

    public String getSourceSecretKey() {
        return sourceSecretKey;
    }

    public void setSourceSecretKey(String sourceSecretKey) {
        this.sourceSecretKey = sourceSecretKey;
    }

    public String getDestinationAddress() {
        return destinationAddress;
    }

    public void setDestinationAddress(String destinationAddress) {
        this.destinationAddress = destinationAddress;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}

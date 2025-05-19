# Crypto Wallet Backend

A Spring Boot application that integrates with the Stellar blockchain network to provide wallet management functionality with Privy authentication.

## Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Setup and Configuration](#setup-and-configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
    - [Status Endpoints](#status-endpoints)
    - [Authentication Endpoints](#authentication-endpoints)
    - [Wallet Endpoints](#wallet-endpoints)
- [Error Handling](#error-handling)
- [Build and Run](#build-and-run)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Security Considerations](#security-considerations)

## Overview

This backend service provides a secure and scalable way to interact with the Stellar blockchain network. It offers functionality for creating wallets, checking balances, and sending payments on the Stellar network while handling authentication through Privy.

## Technologies

- **Java 17**
- **Spring Boot 3.1.3**
- **Stellar SDK**: Integration with Stellar blockchain
- **PostgreSQL**: Database storage
- **Privy**: Authentication service
- **JWT**: Token-based authentication
- **Liquibase**: Database migrations
- **Prometheus & Actuator**: Monitoring

## Prerequisites

- Java 17 or higher
- Gradle
- PostgreSQL database
- Stellar account (testnet for development, public for production)
- Privy API credentials

## Setup and Configuration

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cryptowallet-backend
   ```

2. **Configure application properties**

   Create an `application.properties` or `application.yml` file in `src/main/resources` with the following properties:

   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/cryptowallet
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   # Stellar Configuration
   stellar.network=TESTNET  # Use TESTNET for development, PUBLIC for production
   stellar.horizon-url=https://horizon-testnet.stellar.org
   
   # Privy Configuration
   privy.api-url=https://api.privy.io/v1
   privy.api-key=your_privy_api_key
   
   # JWT Configuration
   jwt.secret=your_jwt_secret_key
   jwt.expiration=86400000  # 24 hours in milliseconds
   ```

## Project Structure

```
dev.wallet.backend
├── Server.java                     # Main application entry point
├── Controller                      # API controllers
│   ├── PrivyAuthController.java    # Authentication endpoints
│   ├── StatusController.java       # Server status endpoints
│   └── WalletController.java       # Wallet operations endpoints
├── Service                         # Business logic
│   ├── PrivyService.java           # Authentication service
│   └── StellarService.java         # Stellar blockchain integration
├── Connection                      # DTOs for API communication
│   ├── AuthRequest.java            # Authentication request
│   ├── AuthResponse.java           # Authentication response
│   ├── TransactionRequest.java     # Transaction request
│   └── WalletResponse.java         # Wallet information response
└── Exception                       # Exception handling
    └── GlobalExceptionHandler.java # Centralized error handling
```

## API Documentation

### Status Endpoints

#### GET /api/status
Checks if the server is running properly.

**Response Example:**
```json
{
  "status": "operational",
  "timestamp": "2025-05-15T16:58:43",
  "version": "1.0.0"
}
```

### Authentication Endpoints

#### POST /api/auth/verify
Verifies a Privy authentication token.

**Request:**
```json
{
  "token": "your_privy_token",
  "userId": "user_identifier"
}
```

**Response:**
```json
{
  "valid": true,
  "userId": "user_identifier"
}
```

### Wallet Endpoints

#### POST /api/wallet/generate
Generates a new Stellar wallet.

**Response:**
```json
{
  "publicKey": "GAKXTZ...",
  "secretKey": "SCZANG...",
  "xlmBalance": 0,
  "assetBalances": {}
}
```

#### GET /api/wallet/balance/{address}
Gets the balance for a specific wallet address.

**Response:**
```json
{
  "publicKey": "GAKXTZ...",
  "secretKey": null,
  "xlmBalance": 100.50,
  "assetBalances": {
    "USD:GBKUA...": 25.00
  }
}
```

#### POST /api/wallet/send
Sends a payment from one address to another.

**Request:**
```json
{
  "sourceSecretKey": "SCZANG...",
  "destinationAddress": "GDZYTA...",
  "amount": 10.5
}
```

**Response:**
```
"transaction_hash_string"
```

## Error Handling

The application uses a centralized error handling approach through `GlobalExceptionHandler`. All exceptions are formatted consistently:

```json
{
  "timestamp": "2025-05-15T16:58:43",
  "error": "IllegalArgumentException",
  "message": "Invalid wallet address"
}
```

Common HTTP status codes:
- `400 Bad Request`: For `IllegalArgumentException` and validation errors
- `500 Internal Server Error`: For unexpected errors

## Build and Run

**Build the project:**
```bash
./gradlew build
```

**Run the application:**
```bash
./gradlew bootRun
```

**Build executable JAR:**
```bash
./gradlew bootJar
```

**Run executable JAR:**
```bash
java -jar build/libs/cryptowallet-backend.jar
```

## Development Guidelines

1. **Exception Handling**
    - Always throw meaningful exceptions that describe the issue
    - Use appropriate exception types
    - Don't catch exceptions unless you can handle them properly

2. **Code Style**
    - Use JavaDoc comments for public methods and classes
    - Avoid inline comments except for complex logic
    - Follow Java naming conventions

3. **API Design**
    - Use DTOs for request/response objects
    - Validate request data at controller level
    - Return appropriate HTTP status codes

4. **Security**
    - Never log sensitive data (private keys, auth tokens)
    - Always validate user input
    - Use HTTPS in production

## Testing

Run the tests with:
```bash
./gradlew test
```

The project uses JUnit 5 for testing along with Spring Boot Test and TestContainers for integration testing.

## Security Considerations

1. **Stellar Key Management**
    - Never store secret keys in the database
    - Only transmit secret keys over secure connections
    - Consider implementing a key management service for production

2. **Authentication**
    - Privy handles the primary authentication
    - Verify tokens on each sensitive request
    - Implement rate limiting for authentication endpoints

3. **Transaction Safety**
    - Validate transaction amounts
    - Consider implementing transaction limits
    - Log all transaction attempts (success and failure)
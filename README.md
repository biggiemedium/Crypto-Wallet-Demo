# Stellar Crypto Wallet

A secure web-based cryptocurrency wallet application built with Spring Boot and JavaScript, integrating with the Stellar blockchain network.

## Project Overview

This application provides a user-friendly interface for managing cryptocurrency assets on the Stellar network. It features secure authentication, wallet management, and transaction capabilities.

## Features

- **User Authentication**: Secure login and registration system
- **Stellar Wallet Integration**: Create and manage Stellar blockchain wallets
- **Transaction Management**: Send and receive cryptocurrency
- **Dashboard Interface**: Monitor balances and transaction history
- **Security**: Industry-standard security practices including CORS protection and Spring Security

## Technical Stack

### Backend
- **Language**: Java
- **Framework**: Spring Boot
- **Security**: Spring Security
- **Blockchain SDK**: Stellar Java SDK (java-stellar-sdk)
- **Database**: PostgreSQL with Liquibase migrations
- **API**: RESTful API endpoints

### Frontend
- **Languages**: HTML, CSS, JavaScript
- **Design**: Responsive interface with dark mode aesthetics
- **Session Management**: Client-side session storage
- **API Integration**: Fetch API for backend communication

## Project Structure

### Backend Components
- **Controllers**: API endpoints for authentication, wallet operations
- **Services**: User management, Stellar blockchain interaction
- **Models**: Data models for users and wallet information
- **Configuration**: Security, CORS, and application settings

### Frontend Components
- **Authentication Pages**: Login and signup interfaces
- **Dashboard**: Main wallet interface
- **Transaction UI**: Forms for sending/receiving assets

## Getting Started

### Prerequisites
- JDK 17+
- PostgreSQL
- Node.js (for development tools)

### Setup
1. Clone the repository
2. Configure database connection in application properties
3. Run the Spring Boot application
4. Access the web interface at http://localhost:8081

## Development Mode

The application includes a development mode with test users:
- Username: `john` / Password: `doe`
- Username: `jim` / Password: `lee`

## Security Considerations

- CORS protection for API endpoints
- CSRF protection disabled for API access
- Session-based authentication
- Secure password handling

## API Endpoints

- `/api/auth/login` - User authentication
- `/api/signup` - User registration
- `/api/wallet/health` - System health check

## Storage

User data is stored both in the database and in a local file (`./data/users.txt`) for development purposes.

---

*Last updated: 2025-05-16*

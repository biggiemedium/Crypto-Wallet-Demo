/**
 * Service for managing dashboard data and interactions with the server.
 * Handles fetching portfolio data, transactions, and other dashboard information.
 *
 * @author James
 * @version 1.0
 * @since 2025-05-15
 */
class DashboardService {
    /**
     * Creates a new DashboardService instance.
     *
     * @param {string} apiUrl - Base URL for the API
     * @param {LoginService} loginService - Reference to the authentication service
     */
    constructor(apiUrl, loginService) {
        /**
         * Base URL for the API
         */
        this.apiUrl = apiUrl;

        /**
         * Reference to the authentication service
         */
        this.loginService = loginService;

        /**
         * Current user data
         */
        this.userData = null;

        /**
         * Current portfolio data
         */
        this.portfolioData = null;

        /**
         * Current market data
         */
        this.marketData = null;

        /**
         * Current date and time
         */
        this.currentDateTime = "2025-05-15 03:51:28";
    }

    /**
     * Initializes the dashboard service and loads initial data.
     *
     * @returns {Promise<boolean>} True if initialization was successful
     */
    async initialize() {
        if (!this.loginService.isAuthenticated()) {
            window.location.href = 'Login.html';
            return false;
        }

        try {
            await Promise.all([
                this.loadUserData(),
                this.loadPortfolioData(),
                this.loadTransactionsData(),
                this.loadMarketData()
            ]);

            return true;
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            return false;
        }
    }

    /**
     * Loads user profile data.
     *
     * @returns {Promise<object>} User data
     */
    async loadUserData() {
        try {
            // For demo purposes, we'll use mock data
            this.userData = {
                username: this.loginService.getCurrentUsername() || 'biggiemedium',
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                lastLogin: this.currentDateTime,
                securityScore: 75
            };

            return this.userData;
        } catch (error) {
            console.error('Failed to load user data:', error);
            throw error;
        }
    }

    /**
     * Loads portfolio data including balances and assets.
     *
     * @returns {Promise<object>} Portfolio data
     */
    async loadPortfolioData() {
        try {
            // For demo purposes, we'll use mock data
            this.portfolioData = {
                totalBalance: 34527.89,
                change24h: {
                    value: 824.35,
                    percentage: 2.4,
                    isPositive: true
                },
                allTimeReturn: {
                    value: 12452.65,
                    percentage: 56.3,
                    isPositive: true
                },
                assets: [
                    {
                        id: 'bitcoin',
                        name: 'Bitcoin',
                        symbol: 'BTC',
                        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                        price: 45678.23,
                        holdings: 0.4512,
                        value: 20610.82,
                        change24h: 2.8,
                        isPositive: true,
                        color: '#F7931A'
                    },
                    {
                        id: 'ethereum',
                        name: 'Ethereum',
                        symbol: 'ETH',
                        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                        price: 2897.45,
                        holdings: 3.2,
                        value: 9271.84,
                        change24h: 1.5,
                        isPositive: true,
                        color: '#627EEA'
                    },
                    {
                        id: 'cardano',
                        name: 'Cardano',
                        symbol: 'ADA',
                        icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
                        price: 1.42,
                        holdings: 2500,
                        value: 3550.00,
                        change24h: -0.8,
                        isPositive: false,
                        color: '#0033AD'
                    },
                    {
                        id: 'solana',
                        name: 'Solana',
                        symbol: 'SOL',
                        icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
                        price: 107.85,
                        holdings: 10,
                        value: 1078.50,
                        change24h: 5.2,
                        isPositive: true,
                        color: '#00FFA3'
                    }
                ],
                historicalData: {
                    '1w': [
                        { date: '2025-05-08', value: 32450.67 },
                        { date: '2025-05-09', value: 32890.34 },
                        { date: '2025-05-10', value: 33120.85 },
                        { date: '2025-05-11', value: 33015.43 },
                        { date: '2025-05-12', value: 33562.78 },
                        { date: '2025-05-13', value: 34125.62 },
                        { date: '2025-05-14', value: 33982.45 },
                        { date: '2025-05-15', value: 34527.89 }
                    ]
                }
            };

            return this.portfolioData;
        } catch (error) {
            console.error('Failed to load portfolio data:', error);
            throw error;
        }
    }

    /**
     * Loads transaction history data.
     *
     * @param {number} [page=1] - Page number for pagination
     * @param {number} [limit=10] - Number of transactions per page
     * @returns {Promise<object>} Transaction data
     */
    async loadTransactionsData(page = 1, limit = 10) {
        try {
            // For demo purposes, we'll use mock data
            const transactions = [
                {
                    id: 'tx12345',
                    type: 'receive',
                    asset: 'Bitcoin',
                    symbol: 'BTC',
                    amount: 0.125,
                    value: 5709.78,
                    date: '2025-05-14 16:32:45',
                    status: 'completed',
                    from: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
                    to: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                    txHash: '3a1bda1ad5c58c6862e786488ec5f6caf3a1e0e84113c98b96f0953cce6f5595'
                },
                {
                    id: 'tx12346',
                    type: 'send',
                    asset: 'Ethereum',
                    symbol: 'ETH',
                    amount: 1.5,
                    value: 4346.18,
                    date: '2025-05-13 09:14:22',
                    status: 'completed',
                    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
                    to: '0x8974Bde0A3C42F7A6708085F311F113C3949Dd2a',
                    txHash: '0x2d9240d3ec301322be29cee038f5debc1c7b8f0cd5c8202ced995bfa5a33aa59'
                },
                {
                    id: 'tx12347',
                    type: 'swap',
                    asset: 'Cardano to Solana',
                    symbol: 'ADA → SOL',
                    amount: '500 ADA → 4.53 SOL',
                    value: 710.00,
                    date: '2025-05-12 14:25:13',
                    status: 'completed',
                    provider: 'DeFiSwap',
                    rate: '1 SOL = 110.38 ADA'
                },
                {
                    id: 'tx12348',
                    type: 'receive',
                    asset: 'Solana',
                    symbol: 'SOL',
                    amount: 5.47,
                    value: 590.00,
                    date: '2025-05-10 18:56:30',
                    status: 'completed',
                    from: 'G8JyxaW3pwGAQnj7rKpM9zHeGbhYuJn4nVTF5ZWrJZ4T',
                    to: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
                    txHash: '5j2bDM8znzNUf8Hx3qLHJQmvbAg3Vofkv47r5PcYKKmPiRPm4LeLXKSLWXgX8nz5Vw2nsJg6TZHEkYVjdeTXXnY4'
                },
                {
                    id: 'tx12349',
                    type: 'send',
                    asset: 'Bitcoin',
                    symbol: 'BTC',
                    amount: 0.05,
                    value: 2283.91,
                    date: '2025-05-08 11:03:57',
                    status: 'completed',
                    from: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                    to: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
                    txHash: '8a574b8b357940a8878ee0248d285d435c4e73ef1961b364d2ec3f3322992bed'
                }
            ];

            this.transactionsData = {
                transactions,
                pagination: {
                    currentPage: page,
                    totalPages: 3,
                    totalItems: 25
                }
            };

            return this.transactionsData;
        } catch (error) {
            console.error('Failed to load transactions data:', error);
            throw error;
        }
    }

    /**
     * Loads market data for top cryptocurrencies.
     *
     * @returns {Promise<object>} Market data
     */
    async loadMarketData() {
        try {
            // For demo purposes, we'll use mock data
            this.marketData = {
                stats: {
                    marketCap: '1.82T',
                    volume24h: '84.5B',
                    btcDominance: '42.1%',
                    fearGreedIndex: 65
                },
                coins: [
                    {
                        id: 'bitcoin',
                        name: 'Bitcoin',
                        symbol: 'BTC',
                        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                        price: 45678.23,
                        change24h: 2.8,
                        change7d: 5.6,
                        marketCap: '864.5B',
                        volume24h: '32.6B',
                        circulatingSupply: '18.9M BTC'
                    },
                    {
                        id: 'ethereum',
                        name: 'Ethereum',
                        symbol: 'ETH',
                        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                        price: 2897.45,
                        change24h: 1.5,
                        change7d: 3.2,
                        marketCap: '342.8B',
                        volume24h: '18.7B',
                        circulatingSupply: '118.4M ETH'
                    },
                    {
                        id: 'binancecoin',
                        name: 'Binance Coin',
                        symbol: 'BNB',
                        icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
                        price: 412.78,
                        change24h: 0.8,
                        change7d: -2.1,
                        marketCap: '68.5B',
                        volume24h: '2.1B',
                        circulatingSupply: '166.8M BNB'
                    },
                    {
                        id: 'cardano',
                        name: 'Cardano',
                        symbol: 'ADA',
                        icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
                        price: 1.42,
                        change24h: -0.8,
                        change7d: 4.5,
                        marketCap: '47.2B',
                        volume24h: '1.5B',
                        circulatingSupply: '33.3B ADA'
                    },
                    {
                        id: 'solana',
                        name: 'Solana',
                        symbol: 'SOL',
                        icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
                        price: 107.85,
                        change24h: 5.2,
                        change7d: 12.7,
                        marketCap: '42.6B',
                        volume24h: '3.8B',
                        circulatingSupply: '394.7M SOL'
                    }
                ]
            };

            return this.marketData;
        } catch (error) {
            console.error('Failed to load market data:', error);
            throw error;
        }
    }

    /**
     * Formats a number as currency.
     *
     * @param {number} value - Number to format
     * @param {string} [currency='USD'] - Currency code
     * @returns {string} Formatted currency string
     */
    formatCurrency(value, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(value);
    }

    /**
     * Formats a percentage value.
     *
     * @param {number} value - Number to format
     * @param {boolean} [includeSign=true] - Whether to include + sign for positive values
     * @returns {string} Formatted percentage string
     */
    formatPercentage(value, includeSign = true) {
        const sign = includeSign && value > 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    }
}
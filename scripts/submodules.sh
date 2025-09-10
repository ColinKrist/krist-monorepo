#!/bin/bash

# Submodule management script for krist-monorepo
# Usage: ./scripts/submodules.sh [command]
# Commands: init, update, status, help

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        exit 1
    fi
}

# Function to initialize submodules
init_submodules() {
    print_status "Initializing and updating all submodules..."
    
    if ! git submodule update --init --recursive; then
        print_error "Failed to initialize submodules"
        exit 1
    fi
    
    print_success "All submodules initialized successfully"
}

# Function to update submodules to latest
update_submodules() {
    print_status "Updating all submodules to latest commits..."
    
    if ! git submodule update --remote --recursive; then
        print_error "Failed to update submodules"
        exit 1
    fi
    
    print_success "All submodules updated to latest commits"
    print_warning "Don't forget to commit the submodule updates if you want to pin them"
}

# Function to show submodule status
show_status() {
    print_status "Checking submodule status..."
    
    if ! git submodule status --recursive; then
        print_error "Failed to get submodule status"
        exit 1
    fi
    
    echo ""
    print_status "Submodule summary:"
    git submodule foreach --recursive 'echo "  - $(basename $PWD): $(git log --oneline -1)"'
}

# Function to sync submodule URLs
sync_submodules() {
    print_status "Syncing submodule URLs from .gitmodules..."
    
    if ! git submodule sync --recursive; then
        print_error "Failed to sync submodule URLs"
        exit 1
    fi
    
    print_success "Submodule URLs synced successfully"
}

# Function to show help
show_help() {
    echo "Submodule management script for krist-monorepo"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  init     - Initialize and clone all submodules (for fresh clones)"
    echo "  update   - Update all submodules to their latest commits"
    echo "  status   - Show status and info of all submodules"
    echo "  sync     - Sync submodule URLs from .gitmodules"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 init              # Set up submodules after fresh clone"
    echo "  $0 update            # Pull latest changes for all submodules"
    echo "  $0 status            # Check current state of submodules"
}

# Main script logic
main() {
    check_git_repo
    
    case "${1:-help}" in
        "init")
            init_submodules
            ;;
        "update")
            update_submodules
            ;;
        "status")
            show_status
            ;;
        "sync")
            sync_submodules
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"

#!/bin/bash

# Script to pull Turborepo Remote Cache configuration from deployed Cloudflare Workers
# Usage: ./scripts/pull-turbo-cache-config.sh [worker-name]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SUBMODULE_DIR="$ROOT_DIR/apps/turbo-cache-on-cloudflare"

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

# Function to check if wrangler is authenticated
check_auth() {
    print_status "Checking Wrangler authentication..."
    
    if ! cd "$SUBMODULE_DIR" && npx wrangler whoami > /dev/null 2>&1; then
        print_error "Wrangler is not authenticated"
        echo ""
        echo "Please authenticate wrangler first:"
        echo "  cd apps/turbo-cache-on-cloudflare"
        echo "  npx wrangler auth login"
        echo ""
        echo "Or if you prefer manual setup, check the generated .env.example file"
        exit 1
    fi
    
    print_success "Wrangler is authenticated"
}

# Function to list deployed workers
list_workers() {
    print_status "Listing your deployed Cloudflare Workers..."
    cd "$SUBMODULE_DIR"
    npx wrangler dev --compatibility-date="2023-06-07" --dry-run 2>/dev/null || true
    npx wrangler deployments list 2>/dev/null || {
        print_warning "Could not list deployments. Trying to find workers by name..."
        npx wrangler dev --name="turborepo-remote-cache" --dry-run 2>/dev/null || true
    }
}

# Function to get worker configuration
get_worker_config() {
    local worker_name="${1:-turborepo-remote-cache}"
    print_status "Getting configuration for worker: $worker_name"
    
    cd "$SUBMODULE_DIR"
    
    print_status "Fetching environment variables..."
    if npx wrangler secret:bulk "$worker_name" > /tmp/turbo_secrets.json 2>/dev/null; then
        print_success "Secrets exported to /tmp/turbo_secrets.json"
    else
        print_warning "Could not export secrets bulk. Trying individual secret listing..."
        # Try to get individual secrets (this won't show values, just names)
        npx wrangler secret list "$worker_name" 2>/dev/null || print_warning "Could not list secrets"
    fi
    
    print_status "Fetching KV namespaces..."
    npx wrangler kv:namespace list 2>/dev/null || print_warning "Could not list KV namespaces"
    
    print_status "Fetching R2 buckets..."
    npx wrangler r2 bucket list 2>/dev/null || print_warning "Could not list R2 buckets"
}

# Function to create environment template
create_env_template() {
    local env_file="$ROOT_DIR/.env.turbo-cache.example"
    
    print_status "Creating environment template at .env.turbo-cache.example"
    
    cat > "$env_file" << 'EOF'
# Turborepo Remote Cache Configuration
# Copy this file to .env.turbo-cache and fill in your values

# ================================
# TURBOREPO CLIENT CONFIGURATION
# ================================

# Your deployed Cloudflare Workers URL (without trailing slash)
TURBO_API=https://turborepo-remote-cache.your-account.workers.dev

# Team name (must start with "team_")
TURBO_TEAM=team_your_team_name

# Bearer token for authentication (same as TURBO_TOKEN secret in your worker)
TURBO_TOKEN=your-secret-token-here

# Signature key for artifact integrity (recommended)
TURBO_REMOTE_CACHE_SIGNATURE_KEY=your-signature-key-here

# ================================
# WORKER DEPLOYMENT CONFIGURATION
# ================================

# Cloudflare API Token (for deployment)
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token

# Cloudflare Account ID
CLOUDFLARE_ACCOUNT_ID=your-account-id

# Worker name (from wrangler.jsonc)
WORKER_NAME=turborepo-remote-cache

# ================================
# STORAGE CONFIGURATION
# ================================

# R2 Bucket names (from wrangler.jsonc)
R2_BUCKET_NAME=turborepo-cache
R2_PREVIEW_BUCKET_NAME=turborepo-cache-preview

# KV Namespace ID (if using KV storage instead of R2)
# KV_NAMESPACE_ID=your-kv-namespace-id

# Object expiration in hours (default: 720 = 30 days)
BUCKET_OBJECT_EXPIRATION_HOURS=720

# ================================
# HOW TO GET THESE VALUES
# ================================

# 1. TURBO_API: Your worker URL from Cloudflare Dashboard
#    Go to: Cloudflare Dashboard > Workers & Pages > Your Worker > Triggers
#    Copy the worker URL (without trailing slash)

# 2. TURBO_TOKEN: Get from your deployed worker secrets
#    Run: cd apps/turbo-cache-on-cloudflare && npx wrangler secret list

# 3. CLOUDFLARE_API_TOKEN: Create in Cloudflare Dashboard
#    Go to: Cloudflare Dashboard > My Profile > API Tokens > Create Token
#    Use "Edit Cloudflare Workers" template

# 4. CLOUDFLARE_ACCOUNT_ID: Found in Cloudflare Dashboard
#    Go to: Cloudflare Dashboard > Right sidebar shows Account ID

# 5. R2_BUCKET_NAME: List your R2 buckets
#    Run: cd apps/turbo-cache-on-cloudflare && npx wrangler r2 bucket list

# 6. KV_NAMESPACE_ID: List your KV namespaces (if using KV instead of R2)
#    Run: cd apps/turbo-cache-on-cloudflare && npx wrangler kv:namespace list
EOF

    print_success "Environment template created at: $env_file"
}

# Function to create package.json scripts
add_package_scripts() {
    print_status "Adding turbo cache management scripts to package.json..."
    
    # Check if we need to add scripts to the main package.json
    if ! grep -q "turbo-cache:" "$ROOT_DIR/package.json" 2>/dev/null; then
        print_status "Adding turbo-cache scripts to main package.json"
        # Note: This would require more complex JSON manipulation
        print_warning "Please manually add these scripts to your package.json:"
        cat << 'EOF'

Add these scripts to your main package.json:

"scripts": {
  "turbo-cache:pull-config": "./scripts/pull-turbo-cache-config.sh",
  "turbo-cache:deploy": "cd apps/turbo-cache-on-cloudflare && npm run deploy",
  "turbo-cache:dev": "cd apps/turbo-cache-on-cloudflare && npm run dev",
  "turbo-cache:logs": "cd apps/turbo-cache-on-cloudflare && npx wrangler tail"
}
EOF
    fi
}

# Function to show manual instructions
show_manual_instructions() {
    cat << 'EOF'

=====================================
MANUAL CONFIGURATION INSTRUCTIONS
=====================================

If you prefer to configure manually or wrangler authentication failed:

1. GET YOUR WORKER URL:
   - Go to: Cloudflare Dashboard > Workers & Pages
   - Click on your turborepo-remote-cache worker
   - Copy the URL from the "Triggers" tab

2. GET YOUR SECRETS:
   - In the same worker page, go to "Settings" > "Variables"
   - Look for TURBO_TOKEN in the "Secrets" section
   - You'll see the name but not the value (for security)

3. GET YOUR R2 BUCKETS:
   - Go to: Cloudflare Dashboard > R2 Object Storage
   - Note your bucket names (likely "turborepo-cache")

4. GET YOUR ACCOUNT INFO:
   - Account ID is shown in the right sidebar of Cloudflare Dashboard
   - Create API token at: My Profile > API Tokens > Create Token

5. CONFIGURE YOUR MONOREPO:
   - Copy .env.turbo-cache.example to .env
   - Fill in all the values from steps 1-4
   - Add to your .gitignore: .env

6. UPDATE YOUR TURBO COMMANDS:
   Install dotenv-cli: npm install -D dotenv-cli
   
   Update package.json scripts:
   "build": "dotenv -e .env -- turbo run build"
   "dev": "dotenv -e .env -- turbo run dev"

EOF
}

# Main script logic
main() {
    echo "🚀 Turborepo Remote Cache Configuration Puller"
    echo "=============================================="
    echo ""
    
    # Always create the environment template
    create_env_template
    
    # Check if user wants to try automated pulling
    if [[ "${1:-}" == "--manual" ]]; then
        print_status "Manual mode requested"
        show_manual_instructions
        exit 0
    fi
    
    # Try automated approach
    print_status "Attempting to pull configuration from Cloudflare..."
    
    if check_auth; then
        list_workers
        get_worker_config "${1:-turborepo-remote-cache}"
        add_package_scripts
    else
        print_warning "Automated pull failed. Please use manual instructions below."
        show_manual_instructions
    fi
    
    echo ""
    print_success "Configuration pull completed!"
    print_status "Next steps:"
    echo "1. Copy .env.turbo-cache.example to .env.turbo-cache"
    echo "2. Fill in the actual values using the instructions in the file"
    echo "3. Add .env.turbo-cache to your .gitignore"
    echo "4. Install dotenv-cli: npm install -D dotenv-cli"
    echo "5. Update your turbo scripts to use: dotenv -e .env.turbo-cache -- turbo run [command]"
}

# Show help
show_help() {
    echo "Usage: $0 [options] [worker-name]"
    echo ""
    echo "Options:"
    echo "  --manual     Skip automated pulling and show manual instructions"
    echo "  --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                           # Try to auto-pull from 'turborepo-remote-cache'"
    echo "  $0 my-turbo-cache           # Try to auto-pull from specific worker"
    echo "  $0 --manual                 # Show manual configuration instructions"
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac

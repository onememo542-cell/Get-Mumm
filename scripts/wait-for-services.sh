#!/bin/bash
# Health check helper script for Docker services
# This script waits for all services to be ready before tests start
# Supports: PostgreSQL, Application Server
# Safe to run multiple times (idempotent)

set -e

# Configuration
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5433}"
POSTGRES_USER="${POSTGRES_USER:-test_user}"
POSTGRES_DB="${POSTGRES_DB:-test_db}"
APP_HOST="${APP_HOST:-localhost}"
APP_PORT="${APP_PORT:-3001}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-60}"
RETRY_INTERVAL="${RETRY_INTERVAL:-2}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_wait() {
    echo -e "${YELLOW}[WAIT]${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Wait for PostgreSQL to be ready
wait_for_postgres() {
    local attempt=1
    log_wait "Waiting for PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT}..."
    
    while [ $attempt -le $MAX_ATTEMPTS ]; do
        if command_exists "pg_isready"; then
            if pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; then
                log_info "PostgreSQL is ready!"
                return 0
            fi
        elif command_exists "psql"; then
            if PGPASSWORD="" psql -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1" >/dev/null 2>&1; then
                log_info "PostgreSQL is ready!"
                return 0
            fi
        else
            # Fallback: use nc (netcat) to check if port is open
            if command_exists "nc"; then
                if nc -z "$POSTGRES_HOST" "$POSTGRES_PORT" >/dev/null 2>&1; then
                    log_info "PostgreSQL port is open!"
                    return 0
                fi
            fi
        fi
        
        log_wait "PostgreSQL not ready (attempt $attempt/$MAX_ATTEMPTS)..."
        sleep "$RETRY_INTERVAL"
        attempt=$((attempt + 1))
    done
    
    log_error "PostgreSQL failed to become ready after $MAX_ATTEMPTS attempts"
    return 1
}

# Wait for application server to be ready
wait_for_app_server() {
    local attempt=1
    log_wait "Waiting for Application Server at http://${APP_HOST}:${APP_PORT}..."
    
    while [ $attempt -le $MAX_ATTEMPTS ]; do
        if command_exists "curl"; then
            if curl -f "http://${APP_HOST}:${APP_PORT}/health" >/dev/null 2>&1; then
                log_info "Application Server is ready!"
                return 0
            fi
        else
            # Fallback: use nc (netcat) to check if port is open
            if command_exists "nc"; then
                if nc -z "$APP_HOST" "$APP_PORT" >/dev/null 2>&1; then
                    log_info "Application Server port is open!"
                    return 0
                fi
            fi
        fi
        
        log_wait "Application Server not ready (attempt $attempt/$MAX_ATTEMPTS)..."
        sleep "$RETRY_INTERVAL"
        attempt=$((attempt + 1))
    done
    
    log_error "Application Server failed to become ready after $MAX_ATTEMPTS attempts"
    return 1
}

# Main function
main() {
    log_info "Starting service health checks..."
    log_info "Configuration:"
    log_info "  - PostgreSQL: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
    log_info "  - App Server: http://${APP_HOST}:${APP_PORT}"
    log_info "  - Max Attempts: ${MAX_ATTEMPTS}"
    log_info "  - Retry Interval: ${RETRY_INTERVAL}s"
    
    echo ""
    
    # Wait for PostgreSQL
    if ! wait_for_postgres; then
        log_error "Failed to verify PostgreSQL health"
        return 1
    fi
    
    echo ""
    
    # Wait for Application Server
    if ! wait_for_app_server; then
        log_error "Failed to verify Application Server health"
        return 1
    fi
    
    echo ""
    log_info "All services are healthy and ready for testing!"
    return 0
}

# Run main function
main
exit $?

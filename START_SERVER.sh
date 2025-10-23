#!/bin/bash

echo "🌐 Starting TACLAB Website Server..."
echo "====================================="
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed!"
    echo "📦 Please run ./INSTALL.sh first"
    exit 1
fi

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    mkdir data
    chmod 755 data
fi

echo "✅ PHP version: $(php -v | head -n 1)"
echo ""
echo "🚀 Server starting on http://localhost:8000"
echo ""
echo "📊 Open these URLs in your browser:"
echo "   • Website:   http://localhost:8000/index.html"
echo "   • API Test:  http://localhost:8000/api.php?action=health"
echo ""
echo "🔑 Admin Dashboard Login:"
echo "   • Username: admin"
echo "   • Password: admin"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""
echo "====================================="
echo ""

# Start PHP built-in server
php -S localhost:8000


#!/bin/bash

echo "🚀 TACLAB Real-Time Tracking - Installation Script"
echo "=================================================="
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "⚠️  Homebrew not found. Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "📦 Installing PHP..."
    brew install php
    echo "✅ PHP installed successfully!"
else
    echo "✅ PHP is already installed"
    php -v
fi

echo ""
echo "🔧 Setting up project..."

# Create data directory if it doesn't exist
if [ ! -d "data" ]; then
    mkdir data
    chmod 755 data
    echo "✅ Data directory created"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "🚀 To start your website, run:"
echo "   ./START_SERVER.sh"
echo ""
echo "📊 Then open your browser and visit:"
echo "   http://localhost:8000/index.html"
echo ""


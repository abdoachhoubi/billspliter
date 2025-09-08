#!/bin/bash

# Bill Splitter Build Script
# Makes it easy to create standalone builds

echo "🚀 Bill Splitter Build Script"
echo "=============================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

echo ""
echo "Select build type:"
echo "1) Android Preview (APK - for testing)"
echo "2) iOS Preview (for testing)"
echo "3) Android Production (for Play Store)"
echo "4) iOS Production (for App Store)"
echo "5) Both Android & iOS Preview"
echo "6) Check build status"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🤖 Building Android Preview (APK)..."
        eas build --platform android --profile preview
        ;;
    2)
        echo "🍎 Building iOS Preview..."
        eas build --platform ios --profile preview
        ;;
    3)
        echo "🤖 Building Android Production..."
        eas build --platform android --profile production
        ;;
    4)
        echo "🍎 Building iOS Production..."
        eas build --platform ios --profile production
        ;;
    5)
        echo "📱 Building both Android and iOS Preview..."
        eas build --platform all --profile preview
        ;;
    6)
        echo "📊 Checking build status..."
        eas build:list
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Build process initiated!"
echo "📝 You can check the progress at: https://expo.dev/accounts/its_astro/projects/bill-splitter/builds"
echo "📱 When complete, you'll get a download link for the installable app."

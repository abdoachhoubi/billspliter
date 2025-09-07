#!/bin/bash

# Generate PNG icons from SVG files using ImageMagick or similar
# This script converts the SVG icons to all required sizes

echo "Converting SVG icons to PNG format..."

# Check if magick (ImageMagick) is available
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
elif command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
else
    echo "Error: ImageMagick is not installed. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

# Create PNG from main icon SVG (1024x1024)
echo "Generating icon.png (1024x1024)..."
$CONVERT_CMD assets/icon.svg -resize 1024x1024 assets/icon.png

# Create adaptive icon (512x512) - Android
echo "Generating adaptive-icon.png (512x512)..."
$CONVERT_CMD assets/icon.svg -resize 512x512 assets/adaptive-icon.png

# Create splash icon (400x400) - Centered on splash screen
echo "Generating splash-icon.png (400x400)..."
$CONVERT_CMD assets/splash-icon.svg -resize 400x400 assets/splash-icon.png

# Create full splash screen (1284x2778) - iPhone 14/15 Pro Max resolution
echo "Generating splash.png (1284x2778)..."
$CONVERT_CMD assets/splash.svg -resize 1284x2778 assets/splash.png

# Create favicon (48x48) - Web
echo "Generating favicon.png (48x48)..."
$CONVERT_CMD assets/icon.svg -resize 48x48 assets/favicon.png

# Create additional iOS sizes
echo "Generating iOS specific sizes..."
$CONVERT_CMD assets/icon.svg -resize 180x180 assets/icon-180.png  # iPhone
$CONVERT_CMD assets/icon.svg -resize 167x167 assets/icon-167.png  # iPad Pro
$CONVERT_CMD assets/icon.svg -resize 152x152 assets/icon-152.png  # iPad
$CONVERT_CMD assets/icon.svg -resize 120x120 assets/icon-120.png  # iPhone

echo "Icon generation complete!"
echo ""
echo "Generated files:"
echo "- assets/icon.png (1024x1024) - Main app icon"
echo "- assets/adaptive-icon.png (512x512) - Android adaptive icon"
echo "- assets/splash-icon.png (400x400) - Splash screen icon"
echo "- assets/splash.png (1284x2778) - Full splash screen"
echo "- assets/favicon.png (48x48) - Web favicon"
echo "- assets/icon-180.png (180x180) - iPhone app icon"
echo "- assets/icon-167.png (167x167) - iPad Pro app icon"
echo "- assets/icon-152.png (152x152) - iPad app icon"
echo "- assets/icon-120.png (120x120) - iPhone app icon @2x"

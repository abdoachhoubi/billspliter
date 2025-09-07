# Bill Splitter - App Icon & Splash Screen

## Overview

The Bill Splitter app now features a professionally designed app icon and splash screen that reflects the app's core functionality of splitting bills fairly among friends.

## Design Concept

### App Icon
- **Theme**: Receipt/bill with a split line
- **Colors**: Blue gradient background (#3B82F6 to #1D4ED8) with white receipt
- **Symbol**: Red split line with cross symbol indicating division/splitting
- **Style**: Modern, clean, and easily recognizable at small sizes

### Visual Elements
- **Background**: Blue gradient circle representing trust and reliability
- **Bill/Receipt**: White paper with rounded corners and perforation dots at top
- **Content Lines**: Gray horizontal lines representing bill items
- **Split Indicator**: Red dashed line with white cross symbol
- **Total Section**: Green bar at bottom representing resolved payment

## Generated Assets

### Main Assets
- `icon.png` (1024x1024) - Primary app icon for app stores
- `adaptive-icon.png` (512x512) - Android adaptive icon foreground
- `splash.png` (1284x2778) - Full splash screen with app name and tagline
- `splash-icon.png` (400x400) - Centered icon for simple splash screens
- `favicon.png` (48x48) - Web browser favicon

### iOS Specific Sizes
- `icon-180.png` (180x180) - iPhone app icon
- `icon-167.png` (167x167) - iPad Pro app icon  
- `icon-152.png` (152x152) - iPad app icon
- `icon-120.png` (120x120) - iPhone app icon @2x

## Configuration

The icons are configured in `app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover", 
      "backgroundColor": "#3B82F6"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3B82F6"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## Source Files

The icons are generated from SVG source files:
- `assets/icon.svg` - Main app icon source
- `assets/splash-icon.svg` - Simplified splash icon source  
- `assets/splash.svg` - Full splash screen source

## Regenerating Icons

To regenerate all PNG assets from the SVG sources:

```bash
./generate-icons.sh
```

This script uses ImageMagick to convert the SVG files to PNG at all required resolutions.

## Brand Guidelines

### Colors
- **Primary Blue**: #3B82F6 (rgb(59, 130, 246))
- **Dark Blue**: #1D4ED8 (rgb(29, 78, 216))
- **Split Red**: #EF4444 (rgb(239, 68, 68))
- **Success Green**: #10B981 (rgb(16, 185, 129))
- **Text Gray**: #64748B (rgb(100, 116, 139))

### Typography
- **App Name**: Bold, sans-serif, white text
- **Tagline**: Regular weight, slightly transparent white
- **Size Hierarchy**: 48px for app name, 18px for tagline

### Visual Consistency
- Maintain blue brand color across all platforms
- Ensure icon remains legible at 16x16 pixels (smallest size)
- Use consistent corner radius (20-24px) for receipt shape
- Keep perforation dots aligned and evenly spaced

## Platform Considerations

### iOS
- Icon corners are automatically rounded by the system
- No transparency allowed in app icons
- Splash screen uses full-bleed image with proper safe area handling

### Android
- Adaptive icon allows for different shapes (circle, square, rounded square)
- Background color provides consistent look across launchers
- Splash screen follows Material Design guidelines

### Web
- Favicon supports transparency
- Optimized for dark and light browser themes
- Works well in browser tabs and bookmarks

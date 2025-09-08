# Building Standalone Apps for Bill Splitter

This guide explains how to create installable versions of the Bill Splitter app that run outside of Expo Go.

## Prerequisites

✅ **Already Completed:**
- EAS CLI installed (`eas-cli@12.6.2`)
- EAS project configured (Project ID: `da76841c-5ca4-4a5a-a650-e75e17c3fe61`)
- `eas.json` configuration file created
- App icons and splash screens generated
- Bundle identifiers configured

## Build Types Available

### 1. **Preview Build** (For Testing)
Creates installable APK/IPA files for internal testing:

```bash
# Android APK (can be installed on any Android device)
eas build --platform android --profile preview

# iOS Simulator build (for testing on Mac with Xcode Simulator)
eas build --platform ios --profile preview
```

### 2. **Development Build** (For Development)
Creates a development client with your app's native code:

```bash
# Android development build
eas build --platform android --profile development

# iOS development build
eas build --platform ios --profile development
```

### 3. **Production Build** (For App Stores)
Creates optimized builds ready for App Store/Play Store submission:

```bash
# Android Production (AAB for Play Store)
eas build --platform android --profile production

# iOS Production (for App Store)
eas build --platform ios --profile production
```

## Quick Start: Create a Preview Build

The fastest way to get an installable app is to create a preview build:

### For Android (APK):
```bash
cd /Users/astro/astro/apps/bill-splitter
eas build --platform android --profile preview
```

### For iOS (requires Apple Developer account):
```bash
cd /Users/astro/astro/apps/bill-splitter
eas build --platform ios --profile preview
```

## Step-by-Step Process

### 1. **Login to EAS**
```bash
eas login
# Enter your Expo account credentials
```

### 2. **Build for Android (No Apple Developer Account Needed)**
```bash
# This creates an APK file you can install on any Android device
eas build --platform android --profile preview

# The build will take 5-15 minutes
# You'll get a download link when it's done
```

### 3. **Build for iOS** (Requires Apple Developer Account)
```bash
# First, you need to configure iOS credentials
eas credentials

# Then build
eas build --platform ios --profile preview
```

## App Configuration Details

Your app is configured with:

### Bundle Identifiers:
- **iOS**: `com.billsplitter.app`
- **Android**: `com.billsplitter.app`

### Version Information:
- **Version**: `1.0.0`
- **iOS Build Number**: `1`
- **Android Version Code**: `1`

### Features Configured:
- App icons (1024x1024 main, adaptive icons for Android)
- Splash screen with Bill Splitter branding
- Secure storage for authentication and settings
- Camera and photo library permissions (for future receipt scanning)
- Dark/light theme support
- Multi-language support (10 languages)

## Distribution Options

### 1. **Internal Testing**
- Share the APK/IPA file directly with testers
- Install via file manager (Android) or TestFlight (iOS)

### 2. **App Store Distribution**
- Use production builds
- Submit to Google Play Store and Apple App Store
- Requires developer accounts ($25/year for Google, $99/year for Apple)

### 3. **Enterprise Distribution**
- For internal company use
- Requires Apple Enterprise Developer Program

## Build Commands Reference

```bash
# Check EAS status
eas build:list

# Cancel a build
eas build:cancel [build-id]

# Download a completed build
eas build:download [build-id]

# View build logs
eas build:view [build-id]

# Update credentials
eas credentials

# Configure build profiles
eas build:configure
```

## Troubleshooting

### Common Issues:

1. **"No bundle identifier found"**
   - Solution: Already fixed in app.json with proper bundle IDs

2. **"Missing app icon"**
   - Solution: Already configured with generated icons

3. **"Apple Developer account required"**
   - Solution: Start with Android builds, or sign up for Apple Developer account

4. **"Build failed due to dependencies"**
   - Solution: Ensure all packages are compatible with standalone builds

### Getting Help:
- Check build logs in EAS dashboard
- Visit [Expo documentation](https://docs.expo.dev/build/introduction/)
- Join [Expo Discord](https://discord.gg/expo) for community support

## Next Steps

1. **Create your first build:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Test the installable app** on a real device

3. **Configure app store metadata** when ready for production

4. **Set up CI/CD** for automated builds on code changes

## File Changes Made

✅ **app.json**: Updated with proper bundle identifiers and permissions
✅ **eas.json**: Configured with development, preview, and production profiles
✅ **Assets**: App icons and splash screens already generated
✅ **Dependencies**: All packages compatible with standalone builds

Your app is now ready to be built as a standalone application! 🚀

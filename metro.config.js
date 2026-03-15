const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Exclude macOS resource fork files (._filename) created when copying files from Mac to Windows
config.resolver.blockList = [
  ...(config.resolver.blockList ? [config.resolver.blockList].flat() : []),
  /.*\/\._.*$/,
  /.*\/\.__.*$/,
  // Block @react-native/debugger-frontend — Chrome DevTools files that use
  // import.meta (ESM-only syntax) and must never be bundled into the app.
  /.*\/@react-native\/debugger-frontend\/.*/,
];

// Disable package exports resolution to prevent Metro from resolving packages
// like zustand to their ESM builds (which contain import.meta.env) when
// bundling as a classic <script> for web.
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });

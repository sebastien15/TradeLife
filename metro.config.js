const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Exclude macOS resource fork files (._filename) created when copying files from Mac to Windows
config.resolver.blockList = [
  ...(config.resolver.blockList ? [config.resolver.blockList].flat() : []),
  /.*\/\._.*$/,
  /.*\/\.__.*$/,
];

module.exports = withNativeWind(config, { input: './global.css' });

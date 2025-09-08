// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Make sure native platforms are resolved before web
config.resolver.platforms = ["ios", "android", "native", "web"];

module.exports = config;

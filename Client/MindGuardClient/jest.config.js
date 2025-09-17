// jest.config.js
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Transform specific ESM deps from node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(?:" +
      // React Native / Expo ecosystem that must be transformed
      "react-native" +
      "|@react-native" +
      "|react-native-.*" +
      "|@react-navigation" +
      "|@react-native-async-storage" +
      "|expo(?:nent)?" +
      "|@expo(?:nent)?/.*" +
      "|expo-modules-core" +
      "|@unimodules/.*" +
      "|unimodules-.*" +
      "|sentry-expo" +
      "|native-base" +
      "|@react-native-community/.*" +
      // 🔑 ESM deps used by Redux Toolkit
      "|immer" +
      "|@reduxjs/toolkit" +
      ")/)",
  ],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "@expo/vector-icons": "<rootDir>/__mocks__/expo-vector-icons.js",
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/async-storage.js",

    // Optional app aliases (keep if you use them)
    "^@/(.*)$": "<rootDir>/$1",
    "^Helpers/(.*)$": "<rootDir>/Helpers/$1",
    "^Components/(.*)$": "<rootDir>/Components/$1",
    "^Redux/(.*)$": "<rootDir>/Redux/$1",
    "^Api$": "<rootDir>/Api",
  },

  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/__tests__/**",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!babel.config.js",
    "!metro.config.js",
  ],
};

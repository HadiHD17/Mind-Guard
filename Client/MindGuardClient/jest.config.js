// jest.config.js
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Only ONE transformIgnorePatterns — merge RN/Expo libs that must be transformed
  transformIgnorePatterns: [
    "node_modules/(?!(?:" +
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
      ")/)",
  ],

  // Map common asset modules + add project aliases so mocks in jest.setup.js use stable IDs
  moduleNameMapper: {
    // static assets
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",

    // optional direct mocks (kept if you really have these files)
    "@expo/vector-icons": "<rootDir>/__mocks__/expo-vector-icons.js",
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/async-storage.js",

    // project aliases (adjust if your folder names differ)
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

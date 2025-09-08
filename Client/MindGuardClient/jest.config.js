// jest.config.js
module.exports = {
  preset: "jest-expo", // ⬅️ switch from "react-native" to "jest-expo"
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "react-native-gesture-handler/jestSetup",
    "<rootDir>/jest.setup.js",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|react-native-.*" +
      "|@react-navigation" +
      "|@react-native-async-storage" +
      "|expo(nent)?" +
      "|@expo(nent)?/.*" +
      "|expo-modules-core" +
      "|@unimodules/.*" +
      "|unimodules-.*" +
      "|sentry-expo" +
      "|native-base" +
      "|@react-native-community/.*" +
      ")/)",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "@expo/vector-icons": "<rootDir>/__mocks__/expo-vector-icons.js",
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/async-storage.js",
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

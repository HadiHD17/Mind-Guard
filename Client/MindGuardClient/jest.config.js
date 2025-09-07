module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@react-navigation|expo|@expo|@reduxjs).*)",
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "@expo/vector-icons": "<rootDir>/__mocks__/expo-vector-icons.js",
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/async-storage.js",
  },
  testEnvironment: "node",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/*.test.{js,jsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!babel.config.js",
    "!**/__mocks__/**",
  ],
};

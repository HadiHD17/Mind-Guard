// jest.config.js
module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  transformIgnorePatterns: [
    "node_modules/(?!(?:react-native|@react-native|react-native-.*|@react-navigation|@react-native-async-storage|expo(?:nent)?|@expo(?:nent)?/.*|expo-modules-core|@unimodules/.*|unimodules-.*|sentry-expo|native-base|@react-native-community/.*|immer|@reduxjs/toolkit)/)",
  ],

  moduleNameMapper: {
    // assets
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "@expo/vector-icons": "<rootDir>/__mocks__/expo-vector-icons.js",
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/async-storage.js",

    // ✅ Helpers (relative OR absolute)
    "^(.*)/Helpers/Storage$": "<rootDir>/__mocks__/storage-helpers.js",
    "^(.*)/Helpers/MoodHelpers$": "<rootDir>/__mocks__/mood-helpers.js",
    "^Helpers/Storage$": "<rootDir>/__mocks__/storage-helpers.js",
    "^Helpers/MoodHelpers$": "<rootDir>/__mocks__/mood-helpers.js",
    // ✅ Helpers (more)
    "^(.*)/Helpers/normalizeEntries$":
      "<rootDir>/__mocks__/normalize-entries.js",
    "^Helpers/normalizeEntries$": "<rootDir>/__mocks__/normalize-entries.js",
    "^(.*)/Helpers/CalendarSync$": "<rootDir>/__mocks__/calendar-sync.js",
    "^Helpers/CalendarSync$": "<rootDir>/__mocks__/calendar-sync.js",

    // ✅ Insights / ML
    "^(.*)/ml/riskSeq$": "<rootDir>/__mocks__/risk-seq.js",
    "^ml/riskSeq$": "<rootDir>/__mocks__/risk-seq.js",

    // ✅ Calendar helpers
    "^(.*)/Helpers/RoutineMapper$": "<rootDir>/__mocks__/routine-mapper.js",
    "^Helpers/RoutineMapper$": "<rootDir>/__mocks__/routine-mapper.js",

    // ✅ ML tips helper
    "^(.*)/ml/tipsSeq$": "<rootDir>/__mocks__/tips-seq.js",
    "^ml/tipsSeq$": "<rootDir>/__mocks__/tips-seq.js",

    // ✅ Api (relative OR absolute)
    "^(.*)/Api$": "<rootDir>/__mocks__/api.js",
    "^Api$": "<rootDir>/__mocks__/api.js",

    // aliases if you use @/...
    "^@/(.*)$": "<rootDir>/$1",
  },

  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],

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

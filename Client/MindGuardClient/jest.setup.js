// jest.setup.js

// 1) RNGH setup
try {
  require("react-native-gesture-handler/jestSetup");
} catch {}

// 2) Testing Library
require("@testing-library/jest-native/extend-expect");

// 3) Reanimated + NativeAnimated
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);
try {
  require.resolve("react-native/Libraries/Animated/NativeAnimatedHelper");
  jest.doMock(
    "react-native/Libraries/Animated/NativeAnimatedHelper",
    () => ({})
  );
} catch {}

// 4) AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// 5) Expo GL
jest.mock("expo-gl", () => ({}));

// 6) Redux hooks
const mockStore = {
  getState: jest.fn(() => ({
    user: { user: null, loading: false, error: null },
    auth: { user: null, token: null, loading: false, error: null },
    mood: { moods: [], loading: false, error: null },
    journal: { journals: [], loading: false, error: null },
    routine: { routines: [], loading: false, error: null },
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};
jest.mock("react-redux", () => ({
  useSelector: jest.fn((sel) => sel(mockStore.getState())),
  useDispatch: jest.fn(() => mockStore.dispatch),
  Provider: ({ children }) => children,
  connect: () => (c) => c,
}));

// 7) Navigation
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

// // 8) API mock (kept)
// jest.mock("Api", () => ({
//   get: jest.fn(() => Promise.resolve({ data: { payload: [] } })),
//   post: jest.fn(() =>
//     Promise.resolve({ data: { status: "success", payload: {} } })
//   ),
//   put: jest.fn(() => Promise.resolve({ data: { payload: {} } })),
//   delete: jest.fn(() => Promise.resolve({ data: { payload: {} } })),
// }));

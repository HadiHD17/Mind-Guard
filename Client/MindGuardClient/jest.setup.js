// jest.setup.js

// 1) Gesture Handler setup (if installed)
try {
  require("react-native-gesture-handler/jestSetup");
} catch {}

// 2) Testing Library matchers
require("@testing-library/jest-native/extend-expect");

// 3) Reanimated + NativeAnimated mocks (prevents crashes/warnings)
// Reanimated mock
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// NativeAnimatedHelper moved/doesn't exist in newer RN — mock it only if present.
try {
  // if the module can be resolved, mock it to a no-op
  require.resolve("react-native/Libraries/Animated/NativeAnimatedHelper");
  // use doMock because the name is dynamic (not a string literal at parse time)
  jest.doMock(
    "react-native/Libraries/Animated/NativeAnimatedHelper",
    () => ({})
  );
} catch {
  // nothing to do — on newer RN the module isn't there and that's fine
}

// 4) AsyncStorage mock
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// 5) react-redux hooks
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

// 6) React Navigation (basic mock)
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

// 7) App-specific mocks
jest.mock("./Api", () => ({
  get: jest.fn(() => Promise.resolve({ data: { payload: [] } })),
  post: jest.fn(() =>
    Promise.resolve({ data: { status: "success", payload: {} } })
  ),
  put: jest.fn(() => Promise.resolve({ data: { payload: {} } })),
  delete: jest.fn(() => Promise.resolve({ data: { payload: {} } })),
}));

jest.mock("./Helpers/MoodHelpers", () => ({
  moodToEmoji: { happy: "😊", sad: "😢", angry: "😠", neutral: "😐" },
  getDayOfWeek: jest.fn(() => "Mon"),
}));

jest.mock("./Helpers/Storage", () => ({
  getUserData: jest.fn(() => Promise.resolve(null)),
  setUserData: jest.fn(() => Promise.resolve()),
  removeUserData: jest.fn(() => Promise.resolve()),
}));

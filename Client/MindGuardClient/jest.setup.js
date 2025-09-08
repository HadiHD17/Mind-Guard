require("@testing-library/jest-native/extend-expect");

// Mock Redux store
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

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn((selector) => selector(mockStore.getState())),
  useDispatch: jest.fn(() => mockStore.dispatch),
  Provider: ({ children }) => children,
  connect: () => (component) => component,
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock API
jest.mock("./Api", () => ({
  get: jest.fn(() => Promise.resolve({ data: { payload: [] } })),
  post: jest.fn(() =>
    Promise.resolve({ data: { status: "success", payload: {} } })
  ),
  put: jest.fn(() => Promise.resolve({ data: { payload: {} } })),
  delete: jest.fn(() => Promise.resolve({ data: { payload: {} } })),
}));

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock helper functions
jest.mock("./Helpers/MoodHelpers", () => ({
  moodToEmoji: {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
  },
  getDayOfWeek: jest.fn((date) => "Mon"),
}));

// Mock storage helpers
jest.mock("./Helpers/Storage", () => ({
  getUserData: jest.fn(() => Promise.resolve(null)),
  setUserData: jest.fn(() => Promise.resolve()),
  removeUserData: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper", () => ({}));

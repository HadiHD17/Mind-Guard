// __mocks__/api.js
const api = {
  get: jest.fn(async () => ({ data: { payload: [] } })),
  post: jest.fn(async () => ({ data: { status: "success", payload: {} } })),
  put: jest.fn(async () => ({ data: { payload: {} } })),
  delete: jest.fn(async () => ({ data: { payload: {} } })),

  // If your real Api exports a pre-configured axios instance with .create:
  create: jest.fn(() => api),

  // Optional shape parity w/ axios-like clients
  defaults: {},
  interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
};

module.exports = api;

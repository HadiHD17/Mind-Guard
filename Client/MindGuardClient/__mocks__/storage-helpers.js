// Minimal Storage helpers mock used across tests
module.exports = {
  getUserData: jest.fn(async () => null),
  setUserData: jest.fn(async () => {}),
  removeUserData: jest.fn(async () => {}),
};

describe("ProfileScreen", () => {
  it("should be defined", () => {
    const ProfileScreen = require("../index").default;
    expect(ProfileScreen).toBeDefined();
    expect(typeof ProfileScreen).toBe("function");
  });

  it("should export a React component", () => {
    const ProfileScreen = require("../index").default;
    expect(ProfileScreen.name).toBe("ProfileScreen");
  });

  it("should be a function", () => {
    const ProfileScreen = require("../index").default;
    expect(typeof ProfileScreen).toBe("function");
  });
});

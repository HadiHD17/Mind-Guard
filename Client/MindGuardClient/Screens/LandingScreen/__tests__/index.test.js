describe("LandingScreen", () => {
  it("should be defined", () => {
    const LandingScreen = require("../index").default;
    expect(LandingScreen).toBeDefined();
    expect(typeof LandingScreen).toBe("function");
  });

  it("should export a React component", () => {
    const LandingScreen = require("../index").default;
    expect(LandingScreen.name).toBe("LandingScreen");
  });

  it("should be a function", () => {
    const LandingScreen = require("../index").default;
    expect(typeof LandingScreen).toBe("function");
  });
});

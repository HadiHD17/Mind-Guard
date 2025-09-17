describe("HomeScreen", () => {
  it("should be defined", () => {
    const HomeScreen = require("../index").default;
    expect(HomeScreen).toBeDefined();
    expect(typeof HomeScreen).toBe("function");
  });

  it("should export a React component", () => {
    const HomeScreen = require("../index").default;
    expect(HomeScreen.name).toBe("HomeScreen");
  });

  it("should be a function", () => {
    const HomeScreen = require("../index").default;
    expect(typeof HomeScreen).toBe("function");
  });
});

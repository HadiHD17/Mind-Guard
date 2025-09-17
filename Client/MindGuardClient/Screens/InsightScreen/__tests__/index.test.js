describe("InsightScreen", () => {
  it("should be defined", () => {
    const InsightScreen = require("../index").default;
    expect(InsightScreen).toBeDefined();
    expect(typeof InsightScreen).toBe("function");
  });

  it("should export a React component", () => {
    const InsightScreen = require("../index").default;
    expect(InsightScreen.name).toBe("InsightScreen");
  });

  it("should be a function", () => {
    const InsightScreen = require("../index").default;
    expect(typeof InsightScreen).toBe("function");
  });
});

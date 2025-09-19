describe("StatsCard", () => {
  it("should be defined", () => {
    const StatsCard = require("../index").default;
    expect(StatsCard).toBeDefined();
    expect(typeof StatsCard).toBe("function");
  });

  it("should export a React component", () => {
    const StatsCard = require("../index").default;
    expect(StatsCard.name).toBe("StatsCard");
  });

  it("should be a function", () => {
    const StatsCard = require("../index").default;
    expect(typeof StatsCard).toBe("function");
  });
});

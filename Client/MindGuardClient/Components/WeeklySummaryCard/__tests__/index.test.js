describe("WeeklySummaryCard", () => {
  it("should be defined", () => {
    const WeeklySummaryCard = require("../index").default;
    expect(WeeklySummaryCard).toBeDefined();
    expect(typeof WeeklySummaryCard).toBe("function");
  });

  it("should export a React component", () => {
    const WeeklySummaryCard = require("../index").default;
    expect(WeeklySummaryCard.name).toBe("WeeklySummaryCard");
  });

  it("should be a function", () => {
    const WeeklySummaryCard = require("../index").default;
    expect(typeof WeeklySummaryCard).toBe("function");
  });
});

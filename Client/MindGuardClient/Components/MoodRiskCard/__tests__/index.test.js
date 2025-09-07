describe("MoodRiskCard", () => {
  it("should be defined", () => {
    const MoodRiskCard = require("../index").default;
    expect(MoodRiskCard).toBeDefined();
    expect(typeof MoodRiskCard).toBe("function");
  });

  it("should export a React component", () => {
    const MoodRiskCard = require("../index").default;
    expect(MoodRiskCard.name).toBe("MoodRiskCard");
  });

  it("should be a function", () => {
    const MoodRiskCard = require("../index").default;
    expect(typeof MoodRiskCard).toBe("function");
  });
});

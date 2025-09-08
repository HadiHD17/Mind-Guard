describe("AIInsightCard", () => {
  it("should be defined", () => {
    const AIInsightCard = require("../index").default;
    expect(AIInsightCard).toBeDefined();
    expect(typeof AIInsightCard).toBe("function");
  });

  it("should export a React component", () => {
    const AIInsightCard = require("../index").default;
    expect(AIInsightCard.name).toBe("AIInsightCard");
  });

  it("should accept title and subtitle props", () => {
    const AIInsightCard = require("../index").default;
    expect(() => {
      AIInsightCard({
        title: "Test Title",
        subtitle: "Test Subtitle",
      });
    }).not.toThrow();
  });
});

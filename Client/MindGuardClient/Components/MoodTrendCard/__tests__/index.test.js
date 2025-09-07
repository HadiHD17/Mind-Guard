describe("MoodTrendCard", () => {
  it("should be defined", () => {
    const MoodTrendCard = require("../index").default;
    expect(MoodTrendCard).toBeDefined();
    expect(typeof MoodTrendCard).toBe("function");
  });

  it("should export a React component", () => {
    const MoodTrendCard = require("../index").default;
    expect(MoodTrendCard.name).toBe("MoodTrendCard");
  });

  it("should be a function", () => {
    const MoodTrendCard = require("../index").default;
    expect(typeof MoodTrendCard).toBe("function");
  });
});

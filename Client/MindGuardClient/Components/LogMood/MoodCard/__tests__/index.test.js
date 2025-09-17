describe("MoodCard", () => {
  it("should be defined", () => {
    const MoodCard = require("../index").default;
    expect(MoodCard).toBeDefined();
    expect(typeof MoodCard).toBe("function");
  });

  it("should export a React component", () => {
    const MoodCard = require("../index").default;
    expect(MoodCard.name).toBe("MoodCard");
  });

  it("should be a function", () => {
    const MoodCard = require("../index").default;
    expect(typeof MoodCard).toBe("function");
  });
});

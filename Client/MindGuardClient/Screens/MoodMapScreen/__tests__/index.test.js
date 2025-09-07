describe("MoodMapScreen", () => {
  it("should be defined", () => {
    const MoodMapScreen = require("../index").default;
    expect(MoodMapScreen).toBeDefined();
    expect(typeof MoodMapScreen).toBe("function");
  });

  it("should export a React component", () => {
    const MoodMapScreen = require("../index").default;
    expect(MoodMapScreen.name).toBe("MoodMapScreen");
  });

  it("should be a function", () => {
    const MoodMapScreen = require("../index").default;
    expect(typeof MoodMapScreen).toBe("function");
  });
});

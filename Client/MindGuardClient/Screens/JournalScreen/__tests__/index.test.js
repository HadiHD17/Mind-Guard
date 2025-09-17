describe("JournalScreen", () => {
  it("should be defined", () => {
    const JournalScreen = require("../index").default;
    expect(JournalScreen).toBeDefined();
    expect(typeof JournalScreen).toBe("function");
  });

  it("should export a React component", () => {
    const JournalScreen = require("../index").default;
    expect(JournalScreen.name).toBe("JournalScreen");
  });

  it("should be a function", () => {
    const JournalScreen = require("../index").default;
    expect(typeof JournalScreen).toBe("function");
  });
});

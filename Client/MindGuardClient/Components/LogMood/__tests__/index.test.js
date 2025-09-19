describe("LogMoodModal", () => {
  it("should be defined", () => {
    const LogMoodModal = require("../index").default;
    expect(LogMoodModal).toBeDefined();
    expect(typeof LogMoodModal).toBe("function");
  });

  it("should export a React component", () => {
    const LogMoodModal = require("../index").default;
    expect(LogMoodModal.name).toBe("LogMoodModal");
  });

  it("should be a function", () => {
    const LogMoodModal = require("../index").default;
    expect(typeof LogMoodModal).toBe("function");
  });
});

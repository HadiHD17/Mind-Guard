describe("Week", () => {
  it("should be defined", () => {
    const Week = require("../index").default;
    expect(Week).toBeDefined();
    expect(typeof Week).toBe("function");
  });

  it("should export a React component", () => {
    const Week = require("../index").default;
    expect(Week.name).toBe("Week");
  });

  it("should be a function", () => {
    const Week = require("../index").default;
    expect(typeof Week).toBe("function");
  });
});

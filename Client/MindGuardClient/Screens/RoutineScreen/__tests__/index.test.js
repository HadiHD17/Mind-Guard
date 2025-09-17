describe("RoutineScreen", () => {
  it("should be defined", () => {
    const RoutineScreen = require("../index").default;
    expect(RoutineScreen).toBeDefined();
    expect(typeof RoutineScreen).toBe("function");
  });

  it("should export a React component", () => {
    const RoutineScreen = require("../index").default;
    expect(RoutineScreen.name).toBe("RoutineScreen");
  });

  it("should be a function", () => {
    const RoutineScreen = require("../index").default;
    expect(typeof RoutineScreen).toBe("function");
  });
});

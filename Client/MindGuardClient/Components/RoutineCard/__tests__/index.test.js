describe("RoutineCard", () => {
  it("should be defined", () => {
    const RoutineCard = require("../index").default;
    expect(RoutineCard).toBeDefined();
    expect(typeof RoutineCard).toBe("function");
  });

  it("should export a React component", () => {
    const RoutineCard = require("../index").default;
    expect(RoutineCard.name).toBe("RoutineCard");
  });

  it("should be a function", () => {
    const RoutineCard = require("../index").default;
    expect(typeof RoutineCard).toBe("function");
  });
});

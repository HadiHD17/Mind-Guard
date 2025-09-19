describe("UpcomingRoutineCard", () => {
  it("should be defined", () => {
    const UpcomingRoutineCard = require("../index").default;
    expect(UpcomingRoutineCard).toBeDefined();
    expect(typeof UpcomingRoutineCard).toBe("function");
  });

  it("should export a React component", () => {
    const UpcomingRoutineCard = require("../index").default;
    expect(UpcomingRoutineCard.name).toBe("UpcomingRoutineCard");
  });

  it("should be a function", () => {
    const UpcomingRoutineCard = require("../index").default;
    expect(typeof UpcomingRoutineCard).toBe("function");
  });
});

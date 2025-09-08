describe("useRoutine", () => {
  it("should be defined", () => {
    const useRoutine = require("../useRoutine").default;
    expect(useRoutine).toBeDefined();
    expect(typeof useRoutine).toBe("function");
  });

  it("should export a custom hook function", () => {
    const useRoutine = require("../useRoutine").default;
    expect(useRoutine.name).toBe("useRoutine");
  });

  it("should import without errors", () => {
    expect(() => {
      require("../useRoutine");
    }).not.toThrow();
  });

  it("should have the correct module structure", () => {
    const module = require("../useRoutine");
    expect(module).toBeDefined();
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe("function");
  });

  it("should accept userId and accessToken parameters", () => {
    const useRoutine = require("../useRoutine").default;
    expect(useRoutine.length).toBe(2); // useRoutine takes userId and accessToken parameters
  });
});

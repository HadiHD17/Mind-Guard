describe("useMoods", () => {
  it("should be defined", () => {
    const useMoods = require("../useMoods").default;
    expect(useMoods).toBeDefined();
    expect(typeof useMoods).toBe("function");
  });

  it("should export a custom hook function", () => {
    const useMoods = require("../useMoods").default;
    expect(useMoods.name).toBe("useMoods");
  });

  it("should import without errors", () => {
    expect(() => {
      require("../useMoods");
    }).not.toThrow();
  });

  it("should have the correct module structure", () => {
    const module = require("../useMoods");
    expect(module).toBeDefined();
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe("function");
  });

  it("should accept userId parameter", () => {
    const useMoods = require("../useMoods").default;
    expect(useMoods.length).toBe(1); // useMoods takes userId parameter
  });
});

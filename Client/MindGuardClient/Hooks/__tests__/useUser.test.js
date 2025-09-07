describe("useUser", () => {
  it("should be defined", () => {
    const useUser = require("../useUser").default;
    expect(useUser).toBeDefined();
    expect(typeof useUser).toBe("function");
  });

  it("should export a custom hook function", () => {
    const useUser = require("../useUser").default;
    expect(useUser.name).toBe("useUser");
  });

  it("should import without errors", () => {
    expect(() => {
      require("../useUser");
    }).not.toThrow();
  });

  it("should have the correct module structure", () => {
    const module = require("../useUser");
    expect(module).toBeDefined();
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe("function");
  });

  it("should be importable as ES6 default export", () => {
    const useUser = require("../useUser").default;
    expect(useUser).toBeDefined();
    expect(useUser.length).toBe(0); // useUser takes no parameters
  });
});

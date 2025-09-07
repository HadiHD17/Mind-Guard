describe("useLogin", () => {
  it("should be defined", () => {
    const useLogin = require("../useLogin").default;
    expect(useLogin).toBeDefined();
    expect(typeof useLogin).toBe("function");
  });

  it("should export a custom hook function", () => {
    const useLogin = require("../useLogin").default;
    expect(useLogin.name).toBe("useLogin");
  });

  it("should import without errors", () => {
    expect(() => {
      require("../useLogin");
    }).not.toThrow();
  });

  it("should have the correct module structure", () => {
    const module = require("../useLogin");
    expect(module).toBeDefined();
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe("function");
  });

  it("should accept navigation parameter", () => {
    const useLogin = require("../useLogin").default;
    expect(useLogin.length).toBe(1); // useLogin takes navigation parameter
  });
});

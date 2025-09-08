describe("RegisterScreen", () => {
  it("should be defined", () => {
    const RegisterScreen = require("../index").default;
    expect(RegisterScreen).toBeDefined();
    expect(typeof RegisterScreen).toBe("function");
  });

  it("should export a React component", () => {
    const RegisterScreen = require("../index").default;
    expect(RegisterScreen.name).toBe("RegisterScreen");
  });

  it("should be a function", () => {
    const RegisterScreen = require("../index").default;
    expect(typeof RegisterScreen).toBe("function");
  });
});

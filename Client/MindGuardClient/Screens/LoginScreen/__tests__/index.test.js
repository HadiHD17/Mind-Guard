describe("LoginScreen", () => {
  it("should be defined", () => {
    const LoginScreen = require("../index").default;
    expect(LoginScreen).toBeDefined();
    expect(typeof LoginScreen).toBe("function");
  });

  it("should export a React component", () => {
    const LoginScreen = require("../index").default;
    expect(LoginScreen.name).toBe("LoginScreen");
  });

  it("should be a function", () => {
    const LoginScreen = require("../index").default;
    expect(typeof LoginScreen).toBe("function");
  });
});

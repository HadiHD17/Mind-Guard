describe("Input", () => {
  it("should be defined", () => {
    const Input = require("../index").default;
    expect(Input).toBeDefined();
    expect(typeof Input).toBe("function");
  });

  it("should export a React component", () => {
    const Input = require("../index").default;
    expect(Input.name).toBe("Input");
  });

  it("should accept required props", () => {
    const Input = require("../index").default;
    // Test that the function can be called (basic smoke test)
    expect(() => {
      Input({
        label: "Test Label",
        placeholder: "Test Placeholder",
        value: "test value",
        onChangeText: jest.fn(),
      });
    }).not.toThrow();
  });

  it("should handle optional props", () => {
    const Input = require("../index").default;
    expect(() => {
      Input({
        label: "Test Label",
        placeholder: "Test Placeholder",
        value: "test value",
        onChangeText: jest.fn(),
        secureTextEntry: true,
        style: { backgroundColor: "red" },
      });
    }).not.toThrow();
  });
});

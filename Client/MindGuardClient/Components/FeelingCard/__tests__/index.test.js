describe("FeelingCard", () => {
  it("should be defined", () => {
    const FeelingCard = require("../index").default;
    expect(FeelingCard).toBeDefined();
    expect(typeof FeelingCard).toBe("function");
  });

  it("should export a React component", () => {
    const FeelingCard = require("../index").default;
    expect(FeelingCard.name).toBe("FeelingCard");
  });

  it("should accept required props", () => {
    const FeelingCard = require("../index").default;
    // Test that the function can be called (basic smoke test)
    expect(() => {
      FeelingCard({
        title: "Test Title",
        bgColor: "#000000",
        textColor: "#ffffff",
        onPress: jest.fn(),
      });
    }).not.toThrow();
  });
});

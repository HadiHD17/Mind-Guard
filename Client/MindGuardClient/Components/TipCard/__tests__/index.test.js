describe("TipCard", () => {
  it("should be defined", () => {
    const TipCard = require("../index").default;
    expect(TipCard).toBeDefined();
    expect(typeof TipCard).toBe("function");
  });

  it("should export a React component", () => {
    const TipCard = require("../index").default;
    expect(TipCard.name).toBe("TipCard");
  });

  it("should accept text prop", () => {
    const TipCard = require("../index").default;
    expect(() => {
      TipCard({
        text: "This is a test tip",
      });
    }).not.toThrow();
  });

  it("should handle empty text prop", () => {
    const TipCard = require("../index").default;
    expect(() => {
      TipCard({
        text: "",
      });
    }).not.toThrow();
  });
});

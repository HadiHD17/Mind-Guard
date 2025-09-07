describe("JournalCard", () => {
  it("should be defined", () => {
    const JournalCard = require("../index").default;
    expect(JournalCard).toBeDefined();
    expect(typeof JournalCard).toBe("function");
  });

  it("should export a React component", () => {
    const JournalCard = require("../index").default;
    expect(JournalCard.name).toBe("JournalCard");
  });
});

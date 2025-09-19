describe("AddEntryModal", () => {
  it("should be defined", () => {
    const AddEntryModal = require("../index").default;
    expect(AddEntryModal).toBeDefined();
    expect(typeof AddEntryModal).toBe("function");
  });

  it("should export a React component", () => {
    const AddEntryModal = require("../index").default;
    expect(AddEntryModal.name).toBe("AddEntryModal");
  });

  it("should be a function", () => {
    const AddEntryModal = require("../index").default;
    expect(typeof AddEntryModal).toBe("function");
  });
});

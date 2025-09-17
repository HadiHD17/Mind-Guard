describe("AddRoutineModal", () => {
  it("should be defined", () => {
    const AddRoutineModal = require("../index").default;
    expect(AddRoutineModal).toBeDefined();
    expect(typeof AddRoutineModal).toBe("function");
  });

  it("should export a React component", () => {
    const AddRoutineModal = require("../index").default;
    expect(AddRoutineModal.name).toBe("AddRoutineModal");
  });

  it("should be a function", () => {
    const AddRoutineModal = require("../index").default;
    expect(typeof AddRoutineModal).toBe("function");
  });
});
